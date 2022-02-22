import { NoteEditorComponent } from './note-editor/note-editor.component';
import { SharedNotesListComponent } from './shared-notes-list/shared-notes-list.component';
import { MyNotesListComponent } from './my-notes-list/my-notes-list.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'notes',
    component: MyNotesListComponent
  },
  {
    path: 'notes/shared',
    component: SharedNotesListComponent
  },
  {
    path: 'notes/:id',
    component: NoteEditorComponent
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
