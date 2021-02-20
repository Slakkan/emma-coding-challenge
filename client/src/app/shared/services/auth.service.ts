import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _firebaseUser: firebase.User | undefined;
  private _firebaseIdToken: string = '';
  constructor() { }

  get firebaseIdToken() {
    return this._firebaseIdToken
  }

  set setFirebaseToken(token: string) {
    this._firebaseIdToken = token
  }

  get firebaseUser() {
    return this._firebaseUser
  }

  set setFirebaseUser(user: firebase.User) {
    this._firebaseUser = user
  }
}
