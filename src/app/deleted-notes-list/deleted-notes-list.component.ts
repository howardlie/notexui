import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-deleted-notes-list',
  templateUrl: './deleted-notes-list.component.html',
  styleUrls: ['./deleted-notes-list.component.scss'],
})
export class DeletedNotesListComponent implements OnInit {

  constructor(public actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {}

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Notes Title',
      buttons: [
        {
          text: 'Delete Permanently',
          handler: () => {
            console.log('Destructive clicked');
          },
        },
        {
          text: 'Restore',
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
