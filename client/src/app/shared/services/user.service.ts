import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppClient } from 'src/models/client';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api = `${window.location.protocol}//${window.location.hostname}:5000`;
  client = `${window.location.protocol}//${window.location.hostname}:4200`;

  constructor(private http: HttpClient) { }

  postClient(client: AppClient): Observable<string> {
    return this.http.post<string>(this.api + '/clients', { client });
  }

  updateClient(client: AppClient): Observable<string> {
    return this.http.put<string>(this.api + '/clients', { client });
  }

  getClients(): Observable<AppClient[]> {
    return this.http.get<{ clients: AppClient[]; }>(this.api + '/clients').pipe(
      map(res => res.clients)
    );
  }
}
