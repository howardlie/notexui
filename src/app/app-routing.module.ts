import { AuthGuardService } from './auth-guard.service';
import { NoteEditorComponent } from './note-editor/note-editor.component';
import { SharedNotesListComponent } from './shared-notes-list/shared-notes-list.component';
import { MyNotesListComponent } from './my-notes-list/my-notes-list.component';
import { ArchivedNotesListComponent } from './archived-notes-list/archived-notes-list.component';
import { DeletedNotesListComponent } from './deleted-notes-list/deleted-notes-list.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full'
  },
  {
    path: 'notes',
    component: MyNotesListComponent,
    //canActivate: [AuthGuardService]
  },
  {
    path: 'notes/shared',
    component: SharedNotesListComponent,
    //canActivate: [AuthGuardService]
  },
  {
    path: 'notes/archived',
    component: ArchivedNotesListComponent,
    //canActivate: [AuthGuardService]
  },
  {
    path: 'notes/deleted',
    component: DeletedNotesListComponent,
    //canActivate: [AuthGuardService]
  },
  {
    path: 'notes/:id',
    component: NoteEditorComponent,
    //canActivate: [AuthGuardService]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
