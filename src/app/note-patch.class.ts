import { v4 as uuidv4 } from 'uuid';

export class NotePatch {
  id: string;
  patch: string;
  version: Number;
  datetime: Date = new Date();
  note_id: string;

  constructor(note_patch: NotePatch = null, note_id = null) {
    if (note_patch == null) {
      this.id = uuidv4();
      this.note_id = note_id;
    } else {
      this.id = note_patch.id;
      this.patch = note_patch.patch;
      this.version = note_patch.version;
      this.datetime = note_patch.datetime;
      this.note_id = note_patch.note_id;
    }
  }
}
