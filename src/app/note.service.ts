import { DeviceService } from './device.service';
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
  private noteSyncer = timer(1000*60*1,1000*60*10);
  private notifSyncer = timer(1000*60*1,1000*60*1);
  public lastSync: Date;
  public loading: boolean = false;
  private isOnline: boolean;

  constructor(private http: HttpClient, private authService: AuthService, private deviceService: DeviceService) {
    this.notes = JSON.parse(localStorage.getItem('notes')) ?? new Array();
    this.notesBS = new Subject();
    this.notesBS.subscribe(notes => {
      localStorage.setItem('notes', JSON.stringify(notes));
    });
    this.authService.loggedInUser.subscribe((user) => {
      if (user != null) {
        this.sync();
      } else {
        this.notes = new Array();
      }
    });

    this.deviceService.onlineStatus.subscribe(val => {
      this.isOnline = val;
    });

    this.noteSyncer.subscribe(() => {
      if (this.isOnline) {
        this.sync();
      }
    });

    this.notifSyncer.subscribe(() => {
      if (('PushManager' in window) && !(navigator.userAgent.toLowerCase().indexOf("android") > -1)) {
        this.setRemindersTimer();
      }
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
  setNoteReminder(id: string, datetime: string) {
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
    notepatch.editor_email = this.authService.currentUser.email;
    notepatch.editor_name = this.authService.currentUser.name;

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

  setRemindersTimer() {
    // delete all ids
    var ids = JSON.parse(localStorage.getItem('ntid'));
    if (ids != null) {
      ids.forEach(element => {
        clearTimeout(element);
      });
    }

    if (Notification.permission != 'granted') {
      return false;
    }

    ids = [];
    console.log(this.notes);
    this.notes.forEach(e => {
      if (e.reminder_datetime != null) {
        let t = (new Date(e.reminder_datetime)).getTime();
        if (Date.now() < t) {
          console.log(t);
          console.log(Date.now());
          console.log(t - Date.now());
          let id = setTimeout(() => {
            // show notification
            new Notification(e.title, { body: "Notification for note " + e.title });
          }, (t - Date.now()));
          ids.push(id);
        }
      }
    });
    localStorage.setItem('ntid', JSON.stringify(ids));

  }

  //need connection
  sync() {
    let payload = new Array();
    for (let i = 0; i < this.notes.length; i++) {
      let note = {...this.notes[i]};
      note.hash = md5(note.text);
      note.text = "";
      if (note.patches != null) {
        note.patches = JSON.parse(JSON.stringify(note.patches));
        let deletedids = [];
        note.patches.forEach((value, index) => {
          if (value.synced) {
            deletedids.push(value.id);
            //note.patches.splice(note.patches.findIndex((v => {v.id == value.id})), 1);
          }
        });
        deletedids.forEach((value) => {
          note.patches.splice(note.patches.findIndex((v => v.id == value)), 1);
        });
      }

      payload.push(note);
    }


    let np = null;
    if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {//if this is android
      np = localStorage.getItem('notification_payload');
    }


    let httpCall = this.http.post<any>(this.authService.baseUrl + '/api/notes/sync', {"notes": payload, "notification_payload": np});
    this.loading = true;
    httpCall.subscribe(response => {
      if (response.status == "OK") {


        for (let i = 0; i < this.notes.length; i++) {
          if (!response.duplicate_notes.includes(this.notes[i].id) && this.notes[i].patches != null) {
            this.notes[i].patches.forEach((value, index) => {
              this.notes[i].patches[index].synced = true;
            });
          }

        }

        for (let i = 0; i < response.note_patchs.length; i++) {
          let patch = response.note_patchs[i];
          let index = this.notes.findIndex(a => a.id == patch.note_id);
          this.notes[index] = this.patchNote(this.notes[index], patch);
          patch.synced = true;
          this.notes[index].patches.push(patch);
        }


        for (let i = 0; i < response.duplicate_notes.length; i++) {
          let element = response.duplicate_notes[i];
          let index = this.notes.findIndex(a => a.id == element);
          this.notes[index].version = 1;
          this.notes[index].account_id = this.authService.currentUser.id;
          this.notes[index].id = uuidv4();
          this.notes[index].title = 'Conflicting note '+ this.notes[index].title;
          let notepatch = new NotePatch(null, this.notes[index].id);
          let version = 1;
          notepatch.editor_email = this.authService.currentUser.email;
          notepatch.editor_name = this.authService.currentUser.name;
          notepatch.version = version;
          this.notes[index].patches = null;
          notepatch.patch = this.dmp.patch_toText(this.dmp.patch_make('', this.notes[index].text));
          if (this.notes[index].patches == null) {
            this.notes[index].patches = new Array();
          }
          this.notes[index].patches.push(notepatch);

        }

        //loop notes (create only)
        for (let i = 0; i < response.notes.length; i++) {
          let element = response.notes[i];
          let index = this.notes.findIndex(a => a.id == element.id);

          let note = new Note(element);

          if (note.patches != null) {
            note.patches.forEach((value) => {
              value.synced = true;
            });
          }

          if (index === -1) {

            this.notes.push(note);
          } else {
            this.notes[index] = note;
          }


        }
        this.notesBS.next(this.notes);
        this.lastSync = new Date();
        localStorage.setItem('lastsync', this.lastSync.toISOString());

      }
      this.loading = false;
      return response;


    });


  }

  //need connection
  async openSharedNote(id: string) {
      let index = this.notes.findIndex(a => a.id == id);
      let note = null;
      if (index === -1) {

        let response = await this.http.get<any>(this.authService.baseUrl + '/api/notes/getShared/' + id).toPromise();


        if (response.status == "OK") {
          note = new Note(response.note);
          this.notes.unshift(note);
          this.notesBS.next(this.notes);
        }


      } else {
        note = this.notes[index];
      }
      //console.log(note);
      return note;
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
