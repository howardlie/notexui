import { NoteService } from './../note.service';
import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-sync-status',
  templateUrl: './sync-status.component.html',
  styleUrls: ['./sync-status.component.scss'],
})
export class SyncStatusComponent implements OnInit {
  public loading: boolean = false;
  isOnline: boolean; // hook to ping event
  constructor(private deviceService: DeviceService, private noteService: NoteService) {

  }

  ngOnInit() {
    this.deviceService.onlineStatus.subscribe(val => {
      this.isOnline = val;
    });
  }

}
