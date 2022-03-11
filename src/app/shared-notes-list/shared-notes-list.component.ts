import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shared-notes-list',
  templateUrl: './shared-notes-list.component.html',
  styleUrls: ['./shared-notes-list.component.scss'],
})
export class SharedNotesListComponent implements OnInit {

  constructor(public actionSheetCtrl: ActionSheetController,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {}

  openNotes() {
    
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Notes Title',
      buttons: [
        {
          text: 'Unshare',
          handler: () => {},
        },
        {
          text: 'Reminders',
          handler: () => {},
        },
        {
          text: 'Duplicate',
          handler: () => {},
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

}
