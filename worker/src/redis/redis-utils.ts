import { RedisClient } from "redis";
import { Observable } from "rxjs";

// CONVENTION: redis "key" will be referenced as HASH in order to
// avoid confusion with the firebase keys which will be called key

export class RedisUtils {
  constructor(private client: RedisClient) {}

  hsetObs(hash: string, key: string, value: Object): Observable<number> {
    return new Observable((sub) => {
      this.client.hset(hash, key, JSON.stringify(value), (err, val) => {
        err ? sub.error(err) : sub.next(val);
        sub.complete()
      });
    });
  }

  // Returns the value inside the hash of a certain key
  hgetObs<T>(hash: string, key: string): Observable<T | null> {
    return new Observable((sub) => {
      this.client.hget(hash, key, (err, val) => {
        let data: T | null;
        if(val) {
          data = JSON.parse(val)
        } else {
          data = null
        }
        err ? sub.error(err) : sub.next(data);
        sub.complete()
      });
    });
  }
}
