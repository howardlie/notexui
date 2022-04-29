import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  constructor() { }

  addPushSubscriber(sub) {
    localStorage.setItem('notification_payload', JSON.stringify(sub));
  }
}
