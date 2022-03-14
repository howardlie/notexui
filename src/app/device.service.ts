import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  public devices = null;
  constructor(private http: HttpClient, private authService: AuthService) {

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
