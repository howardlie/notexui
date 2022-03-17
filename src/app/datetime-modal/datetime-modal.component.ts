import { NoteService } from './../note.service';
import { Note } from './../note.class';
import { ModalController, IonDatetime } from '@ionic/angular';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-datetime-modal',
  templateUrl: './datetime-modal.component.html',
  styleUrls: ['./datetime-modal.component.scss'],
})
export class DatetimeModalComponent implements OnInit {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  @Input() note: Note;

  selectedDate = null;

  minDate: any = new Date().toISOString();

  constructor(public modalController: ModalController, private noteService: NoteService) {

  }

  ngOnInit() {

  }

  confirm() {

    this.noteService.setNoteReminder(this.note.id, this.datetime.value);
    this.datetime.confirm();
    this.dismiss();
  }

  removeReminder() {
    this.noteService.setNoteReminder(this.note.id, null);
    this.dismiss();
  }

  reset() {
    this.datetime.reset();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });


  }

}
