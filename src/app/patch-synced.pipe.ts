import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'patchSynced'
})
export class PatchSyncedPipe implements PipeTransform {

  transform(note: any): any {
    let result = true;
    if (note.patches != null) {
      if (note.patches.length > 0) {
        note.patches.forEach(element => {
          if (!element.synced) {
            result = false;
          }
        });
      }
    }
    return result;
  }

}
