import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseApp = firebase.initializeApp(environment.firebaseConfig);
  firebaseProvider = new firebase.auth.GoogleAuthProvider();

  private _firebaseUser: firebase.User | undefined;
  private _firebaseIdToken: string = '';
  constructor() { }

  get firebaseIdToken() {
    return this._firebaseIdToken;
  }

  get firebaseUser() {
    return this._firebaseUser;
  }

  loginWithPopUp(): Observable<boolean> {
    return from(this.firebaseApp.auth().signInWithPopup(this.firebaseProvider))
      .pipe(
        switchMap((credential) => {
          const user = credential.user as firebase.User;
          const userObs = of(user);
          const tokenIdObs = from(user.getIdToken());
          return forkJoin([userObs, tokenIdObs]);
        }),
        map(([user, token]) => {
          this._firebaseUser = user;
          this._firebaseIdToken = token;
          return true
        })
      )
  }
}
