import { SocialUser } from 'angularx-social-login';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { User } from './user';
import { take, takeUntil } from 'rxjs/operators';

@Injectable(
  //{providedIn: 'root'}
)
export class AuthService {
    public baseUrl = "http://localhost:8000";
    private loggedUserSubject: BehaviorSubject<User>;
    public loggedInUser: Observable<User>;
    public isLoggedin: boolean;
    

    constructor(private http: HttpClient) {
        let getLoggedUser = JSON.parse(localStorage.getItem('loggedInUser'));
        this.loggedUserSubject = new BehaviorSubject(getLoggedUser);
        this.loggedInUser = this.loggedUserSubject.asObservable();
        this.loggedInUser.subscribe((user) => {
          this.isLoggedin = user != null;
        });
        // does not call
        
    }

    loginUser(payload: SocialUser) {
        return this.http.post<any>(this.baseUrl + '/api/authenticate', {payload })
            .subscribe(response=> {
                localStorage.setItem('loggedInUser', JSON.stringify(response));
                this.loggedUserSubject.next(response);
                return response;
            });
    }

    logoutUser() {
      this.http.get<any>(this.baseUrl + '/api/logout')
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
