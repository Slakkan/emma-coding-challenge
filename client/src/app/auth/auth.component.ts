import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app';
import { from, Subscription, of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private router: Router, private ngZone: NgZone) { }

  ngOnInit(): void { }

  onClick() {
    const loginSub = this.authService.loginWithPopUp().subscribe(() => {
      this.ngZone.run(() => this.router.navigate(['clients']));
    });

    this.subscriptions.push(loginSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
