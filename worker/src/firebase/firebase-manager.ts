import * as admin from "firebase-admin";
import { from, Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppClient } from '../models/client';
import { AppUser } from '../models/user';

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
    return from(this.usersRef.get()).pipe(
      map((dataSnapshot) => {
        const userData = (dataSnapshot.toJSON() as { [key: string]: AppUser; })[uid];
        const clientKeys = Object.values(userData.clientKeys);
        return { ...userData, clientKeys };
      }),
    );

  }

  getClients(uid: string): Observable<AppClient[]> {
    return zip(this.getAllClients(), this.getUser(uid)).pipe(
      map(([clientsData, { clientKeys }]) => {
        const clients: AppClient[] = [];
        Object.entries(clientsData).forEach(([key, value]) => {
          if (clientKeys.includes(key)) { clients.push(value); }
        });
        return clients;
      })
    );
  }

  getAllClients(): Observable<{ [key: string]: AppClient; }> {
    return from(this.clientsRef.get()).pipe(
      map((dataSnapshot) => {
        return dataSnapshot.toJSON() as { [key: string]: AppClient; };
      })
    );
  }
}
