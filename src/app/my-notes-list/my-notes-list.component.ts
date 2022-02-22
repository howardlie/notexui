import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-notes-list',
  templateUrl: './my-notes-list.component.html',
  styleUrls: ['./my-notes-list.component.scss'],
})
export class MyNotesListComponent implements OnInit {

  constructor(
    public actionSheetCtrl: ActionSheetController,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {}

  openNotes() {}

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Notes Title',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            console.log('Destructive clicked');
          },
        },
        {
          text: 'Share',
          handler: () => {
            console.log('Destructive clicked');
          },
        },
        {
          text: 'Reminders',
          handler: () => {
            console.log('Destructive clicked');
          },
        },
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          },
        },
        {
          text: 'Duplicate',
          handler: () => {
            console.log('Archive clicked');
          },
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
