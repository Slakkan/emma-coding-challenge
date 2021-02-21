import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  headers = {
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'content-type': 'application/json',
  };

  constructor(private authService: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        ...this.headers,
        'id-token': this.authService.firebaseIdToken
      }
    });
    return next.handle(request);
  }
}