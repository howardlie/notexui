import { Note } from './note';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  public notesBS : BehaviorSubject<Array<Note>>;
  public note: Array<Note>;

  constructor(private http: HttpClient) { 
    this.notesBS = new BehaviorSubject(JSON.parse(localStorage.getItem('notes')));
    this.notesBS.subscribe(notes => {
      localStorage.setItem('notes', JSON.stringify(notes));
    });
  }

  createNotes() {
    
  }

  //need connection
  sync() {

  }

  //need connection
  openSharedNotes(id: string) {

  }

  deleteNotes(id: string) {

  }

  archiveNotes(id: string) {

  }

  //need connection
  shareNotes(id: string) {

  }

  //does this need connection?
  setNotesReminder(id: string, datetime) {

  }

  //need connection
  unshareNotes(id:string) {

  }

  unlinkNotes(id:string) {

  }


  duplicateNotes(id:string) {

  }

  saveNotes(id:string) {

  }


}
