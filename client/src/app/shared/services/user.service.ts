import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppClient } from 'src/models/client';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  api = `${window.location.protocol}//${window.location.hostname}:5000`;
  client = `${window.location.protocol}//${window.location.hostname}:4200`;

  constructor(private http: HttpClient) { }

  postClient(client: AppClient) {
    this.http.post(this.api + '/clients', {client}).subscribe((res) => console.log(res));
  }

  getClients() {
    this.http.get(this.api + '/clients').subscribe((res) => console.log(res));
  }
}
