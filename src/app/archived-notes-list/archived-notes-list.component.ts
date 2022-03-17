import { NoteService } from './../note.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-archived-notes-list',
  templateUrl: './archived-notes-list.component.html',
  styleUrls: ['./archived-notes-list.component.scss'],
})
export class ArchivedNotesListComponent implements OnInit {

  constructor(public actionSheetCtrl: ActionSheetController,
    public noteService: NoteService) { }

  ngOnInit() {}

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
          text: 'Restore',
          handler: () => {
            this.noteService.restoreNote(note.id);
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

  }

}
