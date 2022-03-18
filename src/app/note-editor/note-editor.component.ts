import { DatetimeModalComponent } from './../datetime-modal/datetime-modal.component';
import { AuthService } from './../auth.service';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { DeviceService } from './../device.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//import * as Editor from 'ckeditor5-custom-build/build/ckeditor';
import * as Editor from '../ckeditor5/build/ckeditor';
import { NoteService } from '../note.service';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements OnInit {
  @ViewChild( 'editor' ) editorComponent: CKEditorComponent;
  public isOnline: boolean;
  public Editor = Editor;
  public note = null;
  public isChanged = false;
  constructor(private router: Router, private deviceService: DeviceService, private route: ActivatedRoute, public noteService: NoteService, private actionSheetCtrl: ActionSheetController, private alertController: AlertController, private authService: AuthService, private modalController: ModalController) { }

  ngOnInit() {
    this.deviceService.onlineStatus.subscribe(val => {
      this.isOnline = val;
    });
    this.note = this.noteService.getNote(this.route.snapshot.params['id']);
    //this.editorHeight = this.elementView.nativeElement.offsetHeight
  }

  async presentActionSheet(note) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.note.title,
      buttons: [
        {
          text: 'Archive',
          handler: () => {
            this.noteService.archiveNote(this.note.id);
            this.exit();
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.noteService.deleteNote(this.note.id);
            this.exit();
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
    this.noteService.saveNote(this.note, this.editorComponent.editorInstance.getData());
    this.isChanged = false;

  }

  onChange(event) {
    this.isChanged = true;
  }

  async presentAlertConfirmBack() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to go back? There are changes that needs to be saved',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Save',
          handler: () => {
            this.save();
            this.exit();
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.exit();
          }
        }
      ]
    });

    await alert.present();
  }

  exit() {
    if (this.note.account_id == this.authService.currentUser.id) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/notes/shared']);
    }
  }

  goBack() {

    if (this.isChanged) {
      this.presentAlertConfirmBack();
    } else {
      this.exit();
    }


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
