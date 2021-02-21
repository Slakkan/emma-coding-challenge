import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(): boolean {
    const isLoggedIn = this.authService.firebaseIdToken !== '';
    if (!isLoggedIn) { this.router.navigate(['']); }
    return isLoggedIn;
  }
}
