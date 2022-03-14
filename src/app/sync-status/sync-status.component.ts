import { NoteService } from './../note.service';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sync-status',
  templateUrl: './sync-status.component.html',
  styleUrls: ['./sync-status.component.scss'],
})
export class SyncStatusComponent implements OnInit {
  public loading: boolean = false;
  isOnline: boolean; // hook to ping event
  constructor(private authService: AuthService, private noteService: NoteService) {

  }

  ngOnInit() {
    this.authService.onlineStatus.subscribe(val => {
      this.isOnline = val;
    });
  }

}
