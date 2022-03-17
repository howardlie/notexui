import { DatetimeModalComponent } from './../datetime-modal/datetime-modal.component';
import { AuthService } from './../auth.service';
import { NoteService } from './../note.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shared-notes-list',
  templateUrl: './shared-notes-list.component.html',
  styleUrls: ['./shared-notes-list.component.scss'],
})
export class SharedNotesListComponent implements OnInit {

  constructor(public actionSheetCtrl: ActionSheetController,
    private router: Router,
    public noteService: NoteService,
    private alertController: AlertController,
    public modalController: ModalController,
    public authService: AuthService) { }

  ngOnInit() {}

  openNote(note) {
    this.router.navigate(['notes/'+note.id]);
  }

  async presentActionSheet(note) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: note.title,
      buttons: [
        {
          text: 'Unlink',
          handler: () => {
            this.noteService.permanentlyDelete(note.id);
          },
        },
        {
          text: 'Reminders',
          handler: () => {
            this.presentDatetimeModal(note);
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

}
