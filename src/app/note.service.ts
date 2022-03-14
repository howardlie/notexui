import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  public mynotes = null;

  public sharednotes = null;

  public deletednotes = null;

  public archivednotes = null;

  constructor(private http: HttpClient) { 

  }

  sync() {

  }

  openSharedNotes(id: string) {

  }



}
