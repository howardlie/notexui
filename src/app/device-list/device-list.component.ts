import { DeviceService } from './../device.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent implements OnInit {
  constructor(public modalController: ModalController, public alertController: AlertController, private deviceService: DeviceService) {
  }

  devices = null;

  ngOnInit() {
    this.deviceService.getDeviceList().subscribe(response => {
      if (response.status == "OK") {
        this.devices = response.devices;
      }

    });
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async presentAlertConfirmRevoke() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to revoke all devices access except current devices?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Yes',
          handler: () => {
            this.deviceService.revokeAll().subscribe(response => {
              if (response.status == 'OK') {
                this.dismiss();
              }
            })
          }
        }
      ]
    });

    await alert.present();
  }

}
