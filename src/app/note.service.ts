import { NotePatch } from './note-patch.class';
import { AuthService } from './auth.service';
import { Note } from './note.class';
import { INote } from './note';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import DiffMatchPatch from 'diff-match-patch';
import md5 from 'md5';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  public notesBS : Subject<Array<INote>>;
  public notes: Array<INote>;
  private dmp: DiffMatchPatch = new DiffMatchPatch();
  private noteSyncer = timer(1000*60*10,1000*60*10);
  public lastSync: Date;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.notes = JSON.parse(localStorage.getItem('notes')) ?? new Array();
    this.notesBS = new Subject();
    this.notesBS.subscribe(notes => {
      localStorage.setItem('notes', JSON.stringify(notes));
    });
    this.authService.loggedInUser.subscribe((user) => {
      if (user != null) {
        this.sync();
      }
    });
    this.noteSyncer.subscribe(() => {
      this.sync();
    });

    this.lastSync = new Date(localStorage.getItem('lastsync'));
  }

  createNote() {
    let note = new Note();
    note.account_id = this.authService.currentUser.id;
    this.notes.unshift(note);
    this.notesBS.next(this.notes);
    return note;
  }

  deleteNote(id: string) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes[index].status = -1;
    this.notes[index].updated_at = new Date();
    this.notesBS.next(this.notes);
  }

  archiveNote(id: string) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes[index].status = 0;
    this.notes[index].updated_at = new Date();
    this.notesBS.next(this.notes);
  }

  restoreNote(id: string) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes[index].status = 1;
    this.notes[index].updated_at = new Date();
    this.notesBS.next(this.notes);
  }

  //need connection
  shareNote(id: string) {

    let index = this.notes.findIndex(a => a.id == id);
    this.notes[index].shared = true;
    this.notes[index].updated_at = new Date();
    this.notesBS.next(this.notes);
    this.sync();
  }

  //does this need connection?
  setNoteReminder(id: string, datetime: any) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes[index].reminder_datetime = datetime;
    this.notes[index].updated_at = new Date();
    // does this need to report to server?

    this.notesBS.next(this.notes);
  }

  //need connection
  unshareNote(id:string) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes[index].shared = false;
    this.notes[index].updated_at = new Date();
    this.notesBS.next(this.notes);
    this.sync();
  }

  saveNote(note, newData:string) {
    let index = this.notes.findIndex(a => a.id == note.id);
    let notepatch = new NotePatch(null, note.id);
    let version = this.notes[index].version + 1
    notepatch.version = version;
    notepatch.patch = this.dmp.patch_toText(this.dmp.patch_make(this.notes[index].text, newData));

    //get title
    const parser = new DOMParser();
    const doc = parser.parseFromString(newData, 'text/html');
    const title = doc.getElementsByTagName('h1')[0];

    this.notes[index].title = title.innerText;
    this.notes[index].version = version;
    this.notes[index].text = newData;
    if (this.notes[index].patches == null) {
      this.notes[index].patches = new Array();
    }
    this.notes[index].patches.push(notepatch);
    this.notes[index].updated_at = new Date();
    this.notesBS.next(this.notes);
  }

  patchNote(notes, patch) {
    notes.text = this.dmp.patch_apply(this.dmp.patch_fromText(patch.patch), notes.text);
    notes.version = patch.version;
    return notes;
  }

  //need connection
  sync() {
    let payload = new Array();
    for (let i = 0; i < this.notes.length; i++) {
      let element = this.notes[i];
      let note = {...element};
      note.hash = md5(note.text);
      note.text = "";
      payload.push(note);
    }
    let httpCall = this.http.post<any>(this.authService.baseUrl + '/api/notes/sync', {"notes": payload});
    httpCall.subscribe(response => {
      if (response.status == "OK") {
      	console.log(response);
        //remove local patch
        for (let i = 0; i < this.notes.length; i++) {
          this.notes[i].patches = null;
        }

        for (let i = 0; i < response.note_patchs.length; i++) {
          let element = response.note_patchs[i];
          let index = this.notes.findIndex(a => a.id == element.note_id);
          this.notes[index] = this.patchNote(this.notes[index], element);
        }

        //loop note_dups (change current existing ID)
        for (let i = 0; i < response.duplicate_notes.length; i++) {
          let element = response.duplicate_notes[i];
          let index = this.notes.findIndex(a => a.id == element);
          this.notes[index].version = 0;
          this.notes[index].account_id = this.authService.currentUser.id;
          this.notes[index].id = uuidv4();
          this.notes[index].title = 'Conflicting note '+ this.notes[index].title;
          let notepatch = new NotePatch(null, this.notes[index].id);
          let version = this.notes[index].version + 1
          notepatch.version = version;
          notepatch.patch = this.dmp.patch_toText(this.dmp.patch_make('', this.notes[index].text));
          if (this.notes[index].patches == null) {
            this.notes[index].patches = new Array();
          }
          this.notes[index].patches.push(notepatch);

        }

        //loop notes (create only)
        for (let i = 0; i < response.notes.length; i++) {
          let element = response.notes[i];
          let note = new Note(element);
          this.notes.push(note);
        }






      }
      this.notesBS.next(this.notes);
      this.lastSync = new Date();
      localStorage.setItem('lastsync', this.lastSync.toISOString());
      return response;


    });


    return httpCall;
  }

  //need connection
  openSharedNote(id: string) {
      let httpCall = this.http.get<any>(this.authService.baseUrl + '/api/notes/getShared/' + id);
      httpCall.subscribe(response => {
        console.log(response);
        let note = null;
        if (response.status == "OK") {
          note = new Note(response.note);
          this.notes.unshift(note);
          this.notesBS.next(this.notes);
        }
      });
      return httpCall;
  }

  //need connection
  unlinkNote(id:string) {
    let index = this.notes.findIndex(a => a.id == id);
    if (this.notes[index].account_id != this.authService.currentUser.id) {
      this.notes.splice(index, 1);

    }
  }

  permanentlyDelete(id:string) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes.splice(index,1);
    this.notesBS.next(this.notes);
  }


  duplicateNote(id:string) {
    let index = this.notes.findIndex(a => a.id == id);
    let note = {...this.notes[index]};
    note.id = uuidv4();
    note.shared = false;
    note.created_at = new Date();
    note.patches = null;
    note.status = 1;
    note.account_id = this.authService.currentUser.id;
    note.version = 0;
    this.notes.unshift(note);
    this.notesBS.next(this.notes);
  }

  getNote(id:string) {
    let index = this.notes.findIndex(a => a.id == id);
    return this.notes[index];
  }

  getNoteLink(id: string) {
    let index = this.notes.findIndex(a => a.id == id);
    if (this.notes[index].shared) {
      return window.location.origin + '/notes/' + id;
    }
    return null;
  }


}
