import { AppClient } from '../models/client';

function hasOwnProperty<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export function isDataAppClient(data: object): Promise<AppClient> {
  return new Promise((resolve, reject) => {
    let c1, c2, c3, c4, c5, c6, c7, c8 = false;
    if (typeof data === 'object') {
      c1 = hasOwnProperty(data, 'firstName') && typeof data.firstName === 'string';
      c2 = hasOwnProperty(data, 'lastName') && typeof data.lastName === 'string';
      c3 = hasOwnProperty(data, 'postalCode') && typeof data.postalCode === 'string';
      c4 = hasOwnProperty(data, 'email') && typeof data.email === 'string';
      c5 = hasOwnProperty(data, 'phone') && typeof data.phone === 'string';
      c6 = hasOwnProperty(data, 'city') && typeof data.city === 'string';
      c7 = hasOwnProperty(data, 'country') && typeof data.country === 'string';
      c8 = hasOwnProperty(data, 'isActive') && typeof data.isActive === 'boolean';
      const isAppClient = c1 && c2 && c3 && c4 && c5 && c6 && c7 && c8
      isAppClient ? resolve(data as AppClient) : reject()
    } else {
      reject();
    }
  });
}