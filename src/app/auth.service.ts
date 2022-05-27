import { NoteService } from './note.service';
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
    public baseUrl = "https://note-server.forthe.top";
    private loggedUserSubject: BehaviorSubject<any>;
    public loggedInUser: Observable<any>;
    public isLoggedin: boolean;
    public currentUser: User;


    constructor(private http: HttpClient) {
        let getLoggedUser = JSON.parse(localStorage.getItem('loggedInUser'));
        this.loggedUserSubject = new BehaviorSubject(getLoggedUser);
        this.loggedInUser = this.loggedUserSubject.asObservable();
        this.loggedInUser.subscribe((user) => {
            this.isLoggedin = user != null;
            if (user != null) {
                this.currentUser = user.account;
            }

        });
        this.currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
        // does not call

    }

    loginUser(payload: SocialUser) {
        return this.http.post<any>(this.baseUrl + '/api/authenticate', {payload })
            .subscribe(response=> {
                console.log(this.currentUser);
                console.log(response.account);
                if (this.currentUser != null) {
                  if (response.account.id != this.currentUser.id) {
                    localStorage.removeItem('notes');

                  }
                }

                localStorage.setItem('authToken', JSON.stringify(response.token));
                localStorage.setItem('loggedInUser', JSON.stringify(response.account));
                this.loggedUserSubject.next(response);
                return response;
            });
    }

    logoutUser() {
      this.http.get<any>(this.baseUrl + '/api/logout')
      .subscribe(response=> {
          return response;
      });
        localStorage.removeItem('authToken');
        this.loggedUserSubject.next(null);
    }
    public get loggedInUserValue(){
        return this.loggedUserSubject.value;
    }
}
