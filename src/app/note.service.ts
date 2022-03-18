import { NotePatch } from './note-patch.class';
import { AuthService } from './auth.service';
import { Note } from './note.class';
import { INote } from './note';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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

  constructor(private http: HttpClient, private authService: AuthService) {
    this.notes = JSON.parse(localStorage.getItem('notes')) ?? new Array();
    this.notesBS = new Subject();
    this.notesBS.subscribe(notes => {
      localStorage.setItem('notes', JSON.stringify(notes));
    });
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
    let httpCall = this.http.post<any>(this.authService.baseUrl + '/notes/getShared/', payload);
    httpCall.subscribe(response => {
      if (response.status == "OK") {
        for (let i = 0; i < this.notes.length; i++) {
          let element = this.notes[i];
          element.patches = null;
          
        }
        for (let i = 0; i < response.notes.length; i++) {
          let element = response.notes[i];
          // apply all patch from server
        }
        
      }
      this.notesBS.next(this.notes);
      return response;
      
    });
    
    
    return httpCall;
  }

  //need connection
  openSharedNote(id: string) {
    let index = this.notes.findIndex(a => a.id == id);
    if (index == null) {
      let httpCall = this.http.get<any>(this.authService.baseUrl + '/notes/getShared/' + id);
      httpCall.subscribe(response => {
        let note = null;
        if (response.status == "OK") {
          note = new Note(response.note);
          this.notes.unshift(note);
          this.notesBS.next(this.notes);
        }
        return response;
      });
      return httpCall;
    }
    
    return null;
  }

  //need connection
  unlinkNote(id:string) {
    let index = this.notes.findIndex(a => a.id == id);
    if (this.notes[index].account_id != this.authService.currentUser.id) {
      this.notes.splice(index, 1);
      this.notesBS.next(this.notes);
    }
  }

  permanentlyDelete(id:string) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes.splice(index,1);

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
    console.log(this.notes);
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
