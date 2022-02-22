import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sync-status',
  templateUrl: './sync-status.component.html',
  styleUrls: ['./sync-status.component.scss'],
})
export class SyncStatusComponent implements OnInit {
  public loading: boolean = false;
  public isOnline: boolean = true; // hook to ping event
  constructor() { }

  ngOnInit() {}

}
