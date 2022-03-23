import { v4 as uuidv4 } from 'uuid';

export class NotePatch {
  id: string;
  patch: string;
  version: Number;
  datetime: Date = new Date();
  note_id: string;
  synced: boolean;
  editor_name: string;
  editor_email: string;
  editor_device: string;

  constructor(note_patch: NotePatch = null, note_id = null) {
    if (note_patch == null) {
      this.id = uuidv4();
      this.note_id = note_id;
      this.synced = false;
    } else {
      this.id = note_patch.id;
      this.patch = note_patch.patch;
      this.version = note_patch.version;
      this.datetime = note_patch.datetime;
      this.note_id = note_patch.note_id;
      this.synced = note_patch.synced;
      this.editor_name = note_patch.editor_name;
      this.editor_email = note_patch.editor_email;
      this.editor_device = note_patch.editor_device;
    }
  }
}
