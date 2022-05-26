import { NoteService } from './note.service';
import { ReminderService } from './reminder.service';
import { DeviceService } from './device.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeviceListComponent } from './device-list/device-list.component';
import { AlertController } from '@ionic/angular';
import { SwPush } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  readonly VAPID_PUBLIC_KEY = "BKHMaad8FNpOGnxEqxhj5nhfzGTollnuVvYcMU_e1B7rYCAEKgVB8B_mRIUlaZFmVHvJ1XLg2uVT2OVW6dxkmY4";

  socialUser!: SocialUser;
  isLoggedin?: boolean;
  isOnline: boolean;
  constructor(private swPush: SwPush, private reminderService: ReminderService, public modalController: ModalController, public alertController: AlertController, private socialAuthService: SocialAuthService, public authService: AuthService, private http: HttpClient, private deviceService: DeviceService, private noteService: NoteService) {}

  ngOnInit() {

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.authService.loginUser(this.socialUser);
      //this.socialAuthService.signOut(); takut api authtoken jdi invalid
    });

    
    this.deviceService.onlineStatus.subscribe(val => {
      this.isOnline = val;
    });
    this.deviceService.startRefresh();

    this.subscribeToNotifications();
    
  }

  subscribeToNotifications() {

    this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => this.reminderService.addPushSubscriber(sub))
    .catch(err => console.error("Could not subscribe to notifications", err));
  }

  async presentDevicesModal() {
    const modal = await this.modalController.create({
      component: DeviceListComponent
    });
    return await modal.present();
  }

  async presentAlertConfirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to Logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Yes',
          handler: () => {
            this.logOut();
          }
        }
      ]
    });

    await alert.present();
  }

  logOut(): void {
    this.authService.logoutUser();
    this.socialAuthService.signOut();
  }
}
