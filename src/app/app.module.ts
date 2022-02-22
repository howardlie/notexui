import { SharedNotesListComponent } from './shared-notes-list/shared-notes-list.component';
import { MyNotesListComponent } from './my-notes-list/my-notes-list.component';
import { SyncStatusComponent } from './sync-status/sync-status.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, SyncStatusComponent, MyNotesListComponent, SharedNotesListComponent],
  entryComponents: [SyncStatusComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent, MyNotesListComponent, SharedNotesListComponent],
  exports: [
  ],
})
export class AppModule {}
