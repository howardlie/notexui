import { AuthService } from './auth.service';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeviceListComponent } from './device-list/device-list.component';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  socialUser!: SocialUser;
  isLoggedin?: boolean;
  constructor(public modalController: ModalController, public alertController: AlertController, private socialAuthService: SocialAuthService, private authService: AuthService) {}

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      console.log(this.socialUser);
      this.authService.loginUser
      this.socialAuthService.signOut();
    });
  }

  async presentDevicesModal() {
    const modal = await this.modalController.create({
      component: DeviceListComponent
    });
    return await modal.present();
  }

  async presentAlertConfirmLogout() {
    console.log("clicked logout");
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
          }
        }
      ]
    });

    await alert.present();
  }

  logOut(): void {
    
  }
}
