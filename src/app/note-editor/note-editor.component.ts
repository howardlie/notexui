import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import * as Editor from 'ckeditor5-custom-build/build/ckeditor';
import * as Editor from '../ckeditor5/build/ckeditor';
//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements OnInit {

  public editor = Editor;
  constructor(private router: Router) { }

  ngOnInit() {
    
  }

  goBack() {
    //if private notes
    this.router.navigate(['/']);
    //if shared notes
    //this.router.navigate(['/notes/shared']);
  }

}
