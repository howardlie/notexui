import { NoteService } from './../note.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-deleted-notes-list',
  templateUrl: './deleted-notes-list.component.html',
  styleUrls: ['./deleted-notes-list.component.scss'],
})
export class DeletedNotesListComponent implements OnInit {

  constructor(public actionSheetCtrl: ActionSheetController,
    public noteService: NoteService) { }

  ngOnInit() {}

  async presentActionSheet(note) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: note.title,
      buttons: [

        {
          text: 'Restore',
          handler: () => {
            this.noteService.restoreNote(note.id);
          },
        },
        {
          text: 'Archive',
          handler: () => {
            this.noteService.archiveNote(note.id);
          },
        },
        {
          text: 'Delete Permanently',
          handler: () => {
            this.noteService.permanentlyDelete(note.id);
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
