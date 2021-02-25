import admin from "firebase-admin";
import { AppClient } from "../models/client";
import { NextFunction, Request, Response } from 'express';
import { arrayFromFirebaseObject } from './firebase-utils';
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

  // this method is used as an express middleware to verify a users identity on
  // every call.
  public validateFirebaseToken(req: Request, res: Response, next: NextFunction) {
    admin.auth().verifyIdToken(req.headers['id-token'] as string)
      .then((DecodedIdToken) => {
        req.body.uid = DecodedIdToken.uid;
        req.body.operationId = DecodedIdToken.uid + Date.now();
        next();
      })
      .catch(() => {
        res.status(401);
        res.send("Invalid authentication token");
      });
  }
  // ##########################################################################
  // Pushes the client to firebase and inmediatly returns the key it's going
  // to use. Even though we could get the key synchronously we wait for the
  // server to inform us the status is OK. We don't want our users to think
  // their data is saved when it's not.

  addClient(client: AppClient): Promise<string> {
    return new Promise((resolve, reject) => {
      const operation = this.clientsRef.push(client, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(operation.key!);
        }
      });
    });
  }

  putClient(client: AppClient): Promise<string> {
    return this.clientsRef.child(client.key!).set(client);
  }

  async deleteClient(uid: string, key: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const user = (await this.usersRef.child(uid).get()).val();
      const clientKeys = arrayFromFirebaseObject(user.clientKeys).filter(clientKey => clientKey !== key);
      await this.usersRef.child(uid).update({ clientKeys });
      await this.clientsRef.child(key).remove().catch((err) => reject(err));
      resolve("Client deleted successfully")
    });

  }

  // ##########################################################################
  // If this is the first client added it pushes the data of type AppUser to
  // firebase. If it already exists adds the clientKey to the clientKeys
  // property of the given user
  addClientToUser(uid: string, clientKey: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const dataSnapshot = await this.usersRef.get();
      if (dataSnapshot.hasChild(uid)) {
        const clientKeys = dataSnapshot.val()[uid].clientKeys as string[];
        clientKeys.push(clientKey);
        this.usersRef.child(uid).update({ clientKeys }).then(resolve);
      } else {
        this.usersRef.child(uid).set({ clientKeys: [clientKey] }).then(resolve);
      }
    });
  }
}
