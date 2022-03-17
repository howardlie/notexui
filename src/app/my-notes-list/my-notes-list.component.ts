import { DatetimeModalComponent } from './../datetime-modal/datetime-modal.component';
import { NoteService } from './../note.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
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
    public noteService: NoteService,
    private alertController: AlertController,
    public modalController: ModalController
  ) {}
  ngOnInit() {
  }

  async presentDatetimeModal(note) {
    const modal = await this.modalController.create({
      component: DatetimeModalComponent,
      cssClass: 'max-widths',
      componentProps: {
        'note': note,
      }
    });
    return await modal.present();
  }

  openNote(note) {
    this.router.navigate(['notes/'+note.id]);

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
            this.presentShareDialog(note);
          },
        },
        {
          text: 'Reminders',
          handler: () => {
            this.presentDatetimeModal(note);
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

  }

  onsearch(event) {

  }

  async presentShareDialog(note) {
    let buttons = [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {

        }
      },{
        text: 'Copy Link',
        handler: () => {
          navigator.clipboard.writeText(this.noteService.getNoteLink(note.id));
          const toast = document.createElement('ion-toast');
          toast.message = 'Link copied!';
          toast.duration = 2000;

          document.body.appendChild(toast);
          return toast.present();
        }
      }, {
        text: (!note.shared) ? "Share" : "Unshare",
        handler: () => {
          if (note.shared) {
            this.noteService.unshareNote(note.id);

          } else {
            this.noteService.shareNote(note.id);
            navigator.clipboard.writeText(this.noteService.getNoteLink(note.id));

          }
          const toast = document.createElement('ion-toast');
          toast.message = (note.shared) ? "Link Copied!" : "Unshared";
          toast.duration = 2000;

          document.body.appendChild(toast);
          return toast.present();

        }
      }
    ];

    if (!note.shared) {
      buttons.splice(1,1);
    }

    let alert = await this.alertController.create({
      header: 'Share note',
      message: 'This note is currently <strong>' + ((note.shared) ? "Shared" : "Not Shared") + '</strong>',
      buttons: buttons
    });



    await alert.present();
  }

}
