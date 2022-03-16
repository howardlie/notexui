import { AuthService } from './auth.service';
import { Note } from './note.class';
import { INote } from './note';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import DiffMatchPatch from 'diff-match-patch';

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
    //this.notes.unshift(note); no need to shift until save is pressed

    return note;
  }

  deleteNote(id: string) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes[index].status = -1;
    this.notesBS.next(this.notes);
  }

  archiveNote(id: string) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes[index].status = 0;
    this.notesBS.next(this.notes);
  }

  restoreNote(id: string) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes[index].status = 1;
    this.notesBS.next(this.notes);
  }

  //need connection
  shareNote(id: string) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes[index].shared = true;
    this.notesBS.next(this.notes);
  }

  //does this need connection?
  setNoteReminder(id: string, datetime) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notesBS.next(this.notes);
  }

  //need connection
  unshareNote(id:string) {
    let index = this.notes.findIndex(a => a.id == id);
    this.notes[index].shared = false;
    this.notesBS.next(this.notes);
  }

  //need connection
  sync() {

    this.notesBS.next(this.notes);
  }

  //need connection
  openSharedNote(id: string) {
    let index = this.notes.findIndex(a => a.id == id);
    if (index == null) {

    }
    this.notesBS.next(this.notes);
  }

  unlinkNote(id:string) {
    let index = this.notes.findIndex(a => a.id == id);
    if (this.notes[index].account_id != this.authService.currentUser.id) {
      this.notes.splice(index, 1);
      this.notesBS.next(this.notes);
    }
  }


  duplicateNote(id:string) {
    let index = this.notes.findIndex(a => a.id == id);
    let note = this.notes[index];
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

  saveNote(note) {
    let index = this.notes.findIndex(a => a.id == note.id);
    if (index == null) {
      this.notes.unshift(note);
    } else {
      //generate patch
    }
    this.notesBS.next(this.notes);
  }

  getNote(id:string) {
    let index = this.notes.findIndex(a => a.id == id);
    return this.notes[index];
  }


}
