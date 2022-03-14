import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeviceListComponent } from './device-list/device-list.component';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  socialUser!: SocialUser;
  isLoggedin?: boolean;
  isOnline: boolean;
  constructor(public modalController: ModalController, public alertController: AlertController, private socialAuthService: SocialAuthService, public authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.authService.loginUser(this.socialUser);
      //this.socialAuthService.signOut(); takut api authtoken jdi invalid
    });

    this.authService.onlineStatus.subscribe(val => {
      this.isOnline = val;
    });
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
