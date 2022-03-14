import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Subject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  public onlineStatus: Subject<boolean> = new Subject();

    private connectionChecker = timer(5000,1000*30); //check online / offline

  public devices = null;
  constructor(private http: HttpClient, private authService: AuthService) {
    
  }

  startRefresh() {
    this.connectionChecker.subscribe(() => {
      this.http.get(this.authService.baseUrl + '/api/ping').subscribe(response => {
        this.onlineStatus.next((response['status'] == "OK"));

      }, error => {
        this.onlineStatus.next(false);
      });
    });
    
    this.onlineStatus.next(true);
  }

  getDeviceList() {

    return this.http.get<any>(this.authService.baseUrl + '/api/devices')
    .pipe(take(1));
  }

  revokeAll() {
    return this.http.get<any>(this.authService.baseUrl + '/api/devices/removeaccess')
    .pipe(take(1));
  }


}
