export class NotePatch {
  id: string;
  patch: string;
  version: Number;
  datetime: Date = new Date();
  note_id: string;

  constructor(note_patch: NotePatch, note_id: string) {

  }
}
