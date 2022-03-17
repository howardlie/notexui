import { AuthService } from './../auth.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { DeviceService } from './../device.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//import * as Editor from 'ckeditor5-custom-build/build/ckeditor';
import * as Editor from '../ckeditor5/build/ckeditor';
import { NoteService } from '../note.service';
//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements OnInit {
  public isOnline: boolean;
  public editor = Editor;
  public note = null;
  public isChanged = false;
  constructor(private router: Router, private deviceService: DeviceService, private route: ActivatedRoute, public noteService: NoteService, private actionSheetCtrl: ActionSheetController, private alertController: AlertController, private authService: AuthService) { }

  ngOnInit() {
    this.deviceService.onlineStatus.subscribe(val => {
      this.isOnline = val;
    });
    this.note = this.noteService.getNote(this.route.snapshot.params['id']);
    console.log(this.note);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.note.title,
      buttons: [
        {
          text: 'Archive',
          handler: () => {
            this.noteService.archiveNote(this.note.id);
            this.goBack();
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.noteService.deleteNote(this.note.id);
            this.goBack();
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

  save() {

  }

  async presentShareDialog() {
    const alert = await this.alertController.create({
      header: 'Share note',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  notificationDialog() {

  }

  goBack() {

    if (this.isChanged) {

    }

    if (this.note.account_id == this.authService.currentUser.id) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/notes/shared']);
    }
  }

}
