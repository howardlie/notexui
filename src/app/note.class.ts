import { NotePatch } from './note-patch.class';
import { INote } from './note';
import { v4 as uuidv4 } from 'uuid';

type Nullable<T> = T | null;
export class Note implements INote {
  public id: string;
  public title: string = "";
  public text: string = "";
  public account_id: string;
  public reminder_datetime: Nullable<Date> = null;
  public shared: boolean = false;
  public version: Number = 0;
  public patches: Nullable<Array<NotePatch>> = null;
  public created_at: Date;
  public updated_at: Nullable<Date> = null;
  public status: Number = 1;

  constructor(data: INote = null) {
    if (data == null) {
      this.id = uuidv4();
      this.created_at = new Date();
    } else {
      this.id = data.id;
      this.title = data.title;
      this.text = data.text;
      this.account_id = data.account_id;
      this.reminder_datetime = data.reminder_datetime;
      this.shared = data.shared;
      this.version = data.version;
      this.patches = data.patches;
      this.created_at = data.created_at;
      this.updated_at = data.updated_at;
      this.status = data.status;
    }
  }
}
