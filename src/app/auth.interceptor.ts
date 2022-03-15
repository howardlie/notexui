import { tap } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    authService;

    constructor(inj: Injector) {
        this.authService = inj.get(AuthService)
      }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let loggedInUser = this.authService.loggedInUser;
        if (this.authService.isLoggedin) {
          let token = JSON.parse(localStorage.getItem('authToken'));
          if (token) {
              request = request.clone({
                  setHeaders: {
                      Authorization: `Bearer ${token}`
                  }
              });
          }
          return next.handle(request).pipe(tap(
            event=>{
              if(event instanceof HttpResponse) {
                if (event.body.status != "OK") {
                  this.authService.logoutUser();
                }
                console.log(event);
              }

            }
          ));
        }


        return next.handle(request);
    }
}
