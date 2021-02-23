import * as admin from "firebase-admin";
import { from, Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppClient } from '../models/client';
import { AppUser } from '../models/user';
import { arrayFromFirebaseObject } from './firebase-utils';

const firebaseCredentials = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
};

const firebaseConfig = {
  credential: admin.credential.cert(firebaseCredentials),
  databaseURL: "https://emma-coding-challenge-default-rtdb.firebaseio.com/",
};

export class FirebaseManager {
  app = admin.initializeApp(firebaseConfig);
  database = admin.database();
  usersRef = this.database.ref("/users");
  clientsRef = this.database.ref("/clients");

  constructor() { }

  getUser(uid: string): Observable<AppUser> {
    return from(this.usersRef.child(uid).get()).pipe(
      map((dataSnapshot) => {
        const userData = dataSnapshot.toJSON() as AppUser;
        const clientKeys = userData ? Object.values(userData.clientKeys) : [];
        return { ...userData, clientKeys };
      }),
    );

  }

  getUserClients(uid: string): Observable<AppClient[]> {
    return zip(this.getAllClients(), this.getUser(uid)).pipe(
      map(([clients, { clientKeys }]) => {
        return clients.filter(client => clientKeys.includes(client.key!));;
      })
    );
  }

  getAllClients(): Observable<AppClient[]> {
    return from(this.clientsRef.get()).pipe(
      map((dataSnapshot) => {
        const clients = dataSnapshot.toJSON() as { [key: string]: AppClient; };
        const clientsArray = arrayFromFirebaseObject<AppClient>(clients, true);
        return clientsArray ? clientsArray : [];
      })
    );
  }

  getAllUsers(): Observable<{ [key: string]: AppUser; }> {
    return from(this.usersRef.get()).pipe(
      map((dataSnapshot) => {
        const userData = (dataSnapshot.toJSON() as { [key: string]: AppUser; });
        Object.entries(userData).forEach(([uid, user]) => {
          const clientKeys = arrayFromFirebaseObject<string>(user);
          userData[uid].clientKeys = clientKeys;
        });
        return userData;
      })
    );
  }
}
