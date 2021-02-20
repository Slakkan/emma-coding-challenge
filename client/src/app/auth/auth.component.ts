import { Component, OnDestroy, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import { from, Subscription, of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { clientMock } from 'src/mocks/clientsMock';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  firebaseApp = firebase.initializeApp(environment.firebaseConfig);
  firebaseProvider = new firebase.auth.GoogleAuthProvider();

  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void { }

  onClick() {
    const loginSub = from(
      this.firebaseApp.auth().signInWithPopup(this.firebaseProvider)
    )
      .pipe(
        switchMap((credential) => {
          const user = credential.user as firebase.User;
          const userObs = of(user);
          const tokenIdObs = from(user.getIdToken());
          return forkJoin([userObs, tokenIdObs]);
        })
      )
      .subscribe(([user, token]) => {
        this.authService.setFirebaseUser = user;
        this.authService.setFirebaseToken = token;
        this.userService.getClients();
        setTimeout(() => this.userService.postClient(clientMock), 1000);
      });

    this.subscriptions.push(loginSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
