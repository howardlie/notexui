import { SocialUser } from 'angularx-social-login';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    public baseUrl = "localhost:8000";
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
    }

    loginUser(payload: SocialUser) {


        return this.http.post<any>('http://localhost:8000/api/authenticate', {payload })
            .pipe(retry(1)).subscribe(response=> {
                localStorage.setItem('loggedInUser', JSON.stringify(response));
                this.loggedUserSubject.next(response);
                console.log(response);
                return response;
            });
    }

    logoutUser() {
        localStorage.removeItem('loggedInUser');
        this.loggedUserSubject.next(null);
    }
    public get loggedInUserValue(){
        return this.loggedUserSubject.value;
    }
}
