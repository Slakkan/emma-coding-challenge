// CONFIGURE REDIS
import redis from "redis";
import { forkJoin, Observable, of, zip } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { FirebaseManager } from '../firebase/firebase-manager';
import { AppClient } from '../models/client';
import { AppUser } from '../models/user';

import { RedisUtils } from "./redis-utils";

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT!,
  retry_strategy: () => 1000,
};

export class RedisManager {
  client = redis.createClient(redisConfig);
  subscriber = redis.createClient(redisConfig);
  publisher = redis.createClient(redisConfig);
  utils = new RedisUtils(this.client);
  firebaseManager = new FirebaseManager();

  constructor() {
    this.client.FLUSHDB();
  }

  // ##########################################################################
  // Adds a new key=value pair in the collections users and clients

  // Inside users hash it adds uid={clientKeys:[key]} value
  // if the entry already exists it pushes the new clientKey onto clientKeys
  // instead

  // Inside clients hash it adds clientKey=client
  // Client cannot already exist since firebase generates always a different
  // key

  // If everything goes well it returns the number of added entries
  // TODO: add error handling

  // @params: uid: the unique google identifier for your account
  // @params: key: a key generated from firebase after pushing a new client
  // @params: client: the object with the client data
  addClient(
    uid: string,
    key: string,
    client: AppClient
  ): Observable<[number, number]> {
    return this.utils.hgetObs<AppUser | null>("users", uid).pipe(
      switchMap((userData) => {
        let newUserData;
        if (userData) {
          newUserData = {
            clientKeys: [...userData.clientKeys, key],
          };
        } else {
          newUserData = {
            clientKeys: [key],
          };
        }

        const setUsers = this.utils.hsetObs("users", uid, newUserData);
        const setClients = this.utils.hsetObs("clients", key, client);
        return zip(setUsers, setClients);
      })
    );
  }

  addClientList(clients: AppClient[], uid: string) {
    let clientKeys: string[] = [];
    clients.forEach(client => {
      this.utils.hsetObs("clients", client.key!, client).subscribe();
      clientKeys.push(client.key!);
    });
    this.utils.hsetObs("users", uid, { clientKeys }).subscribe();
  }

  putClient(client: AppClient): Observable<number> {
    return this.utils.hsetObs("clients", client.key!, client);
  }

  getClients(uid: string): Observable<AppClient[]> {
    return this.utils.hgetObs<AppUser>("users", uid).pipe(
      switchMap((user) => {
        if (user) {
          let getDataCalls: Observable<AppClient>[] = [];
          user.clientKeys.forEach((clientKey) => {
            const clientObs = this.utils.hgetObs<AppClient>("clients", clientKey) as Observable<AppClient>;
            getDataCalls.push(clientObs);
          });
          return forkJoin(getDataCalls);
        } else {
          return this.firebaseManager.getUserClients(uid).pipe(tap(clients => {
            this.addClientList(clients, uid);
          }));
        }
      })
    );
  }
}
