import { DeletedNotesListComponent } from './deleted-notes-list/deleted-notes-list.component';
import { ArchivedNotesListComponent } from './archived-notes-list/archived-notes-list.component';
import { DatetimeModalComponent } from './datetime-modal/datetime-modal.component';
import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './auth.interceptor';
import { NoteService } from './note.service';
import { AuthService } from './auth.service';
import { DeviceListComponent } from './device-list/device-list.component';
import { SharedNotesListComponent } from './shared-notes-list/shared-notes-list.component';
import { MyNotesListComponent } from './my-notes-list/my-notes-list.component';
import { SyncStatusComponent } from './sync-status/sync-status.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider
} from 'angularx-social-login';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NoteEditorComponent } from './note-editor/note-editor.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, SyncStatusComponent, MyNotesListComponent, SharedNotesListComponent, NoteEditorComponent, DeviceListComponent, LoginComponent, DatetimeModalComponent, ArchivedNotesListComponent, DeletedNotesListComponent, SafeHtmlPipe],
  entryComponents: [SyncStatusComponent, NoteEditorComponent, DeviceListComponent, LoginComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, CKEditorModule, HttpClientModule, SocialLoginModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' })],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, NoteService, {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false, //keeps the user signed in
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('979671178711-5ro2dvk933me4k23c2ohv3j8o7kgasqq.apps.googleusercontent.com') // your client id
        }
      ]
    }
  },
    AuthGuardService, AuthService],
  bootstrap: [AppComponent, MyNotesListComponent, SharedNotesListComponent, NoteEditorComponent, DatetimeModalComponent, DeletedNotesListComponent, ArchivedNotesListComponent],
  exports: [
  ],
})
export class AppModule {}
