import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'patchSynced'
})
export class PatchSyncedPipe implements PipeTransform {

  transform(note: any): any {
    if (note.patches != null) {
      if (note.patches.length > 0) {
        note.patches.forEach(element => {
          if (!element.synced) {
            console.log(false);
            return false;
          }
        });
      }
    }
    console.log(true);
    return true;
  }

}
