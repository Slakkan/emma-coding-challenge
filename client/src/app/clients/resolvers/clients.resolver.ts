import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

import { UserService } from 'src/app/shared/services/user.service';
import { clientListMock } from 'src/mocks/clientsMock';
import { AppClient } from 'src/models/client';

@Injectable()
export class ClientsResolver implements Resolve<AppClient[]> {
  constructor(private userService: UserService) { }
  resolve(): Observable<AppClient[]> {
    return this.userService.getClients();
  }
}
