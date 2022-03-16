import { NoteService } from './../note.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-notes-list',
  templateUrl: './my-notes-list.component.html',
  styleUrls: ['./my-notes-list.component.scss'],
})
export class MyNotesListComponent implements OnInit {

  constructor(
    public actionSheetCtrl: ActionSheetController,
    private router: Router,
    public noteService: NoteService
  ) {}
  ngOnInit() {}

  openNote(note) {
    this.router.navigate(['notes/'+note.id]);
    //console.log('notes/'+note.id);
  }

  newNote() {
    let note = this.noteService.createNote();
    this.openNote(note);
  }

  async presentActionSheet(note) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: note.title,
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.noteService.deleteNote(note.id);
          },
        },
        {
          text: 'Share',
          handler: () => {
            //show dialog
          },
        },
        {
          text: 'Reminders',
          handler: () => {
            //show dialog
          },
        },
        {
          text: 'Archive',
          handler: () => {
            this.noteService.archiveNote(note.id);
          },
        },
        {
          text: 'Duplicate',
          handler: () => {
            this.noteService.duplicateNote(note.id);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          },
        },
      ],
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  onsearch(event) {

  }

}
