import { NotePatch } from './note-patch.class';
type Nullable<T> = T | null;
export interface INote {
    id: string;
    title: string;
    text: string;
    account_id: string;
    reminder_datetime?: Nullable<Date>;
    shared: boolean;
    version: Number;
    patches: Nullable<Array<NotePatch>>;
    created_at: Date;
    updated_at: Nullable<Date>;
    status: Number;
}
