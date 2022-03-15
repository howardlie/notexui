import { NotePatch } from './note-patch';
export interface Note {
    id: string;
    title: string;
    text: string;
    account_id: string;
    reminder_datetime: Date;
    shared: boolean;
    version: BigInteger;
    patches: Array<NotePatch>;
    created_at: Date;
    updated_at: Date;
    status: Number;
}