import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  goBack() {
    //if private notes
    this.router.navigate(['/']);
    //if shared notes
    //this.router.navigate(['/notes/shared']);
  }

}
