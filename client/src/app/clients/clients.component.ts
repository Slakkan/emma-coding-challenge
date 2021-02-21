import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AppClient } from 'src/models/client';
import { PaginationAction, PaginationActionsEnum } from '../shared/pagination/pagination.model';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: AppClient[] = [];
  paginatedClients: AppClient[] = [];

  paginationActions = new BehaviorSubject<PaginationAction>({
    action: PaginationActionsEnum.PAGINATE
  });

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.clients = this.activatedRoute.snapshot.data[0];
  }

  onPageChanged(paginatedClients: AppClient[]) {
    this.paginatedClients = paginatedClients;
  }
}
