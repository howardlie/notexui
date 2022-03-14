import { SocialUser } from 'angularx-social-login';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { User } from './user';
import { take, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    public baseUrl = "http://localhost:8000";
    private loggedUserSubject: BehaviorSubject<User>;
    public loggedInUser: Observable<User>;
    public isLoggedin: boolean;
    public onlineStatus: Subject<boolean> = new Subject();

    private connectionChecker = interval(1000*60*10); //check online / offline

    constructor(private http: HttpClient) {
        let getLoggedUser = JSON.parse(localStorage.getItem('loggedInUser'));
        this.loggedUserSubject = new BehaviorSubject(getLoggedUser);
        this.loggedInUser = this.loggedUserSubject.asObservable();
        this.loggedInUser.subscribe((user) => {
          this.isLoggedin = user != null;
        });
        this.http.get(this.baseUrl + '/api/ping').pipe(take(1)).subscribe(response => {
          this.onlineStatus.next((response == "OK"));
          return response;
        });
        // does not call
        this.connectionChecker.subscribe(() => {
          this.http.get(this.baseUrl + '/api/ping').pipe(take(1)).subscribe(response => {
            this.onlineStatus.next((response == "OK"));
          });
        });
    }

    loginUser(payload: SocialUser) {
        return this.http.post<any>(this.baseUrl + '/api/authenticate', {payload })
        .pipe(take(1))
            .subscribe(response=> {
                localStorage.setItem('loggedInUser', JSON.stringify(response));
                this.loggedUserSubject.next(response);
                return response;
            });
    }

    logoutUser() {
      this.http.get<any>(this.baseUrl + '/api/logout')
      .pipe(take(1))
      .subscribe(response=> {
          return response;
      });
        localStorage.removeItem('loggedInUser');

        this.loggedUserSubject.next(null);
    }
    public get loggedInUserValue(){
        return this.loggedUserSubject.value;
    }
}
