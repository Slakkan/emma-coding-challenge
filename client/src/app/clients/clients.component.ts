import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AppClient } from 'src/models/client';
import { PaginationAction, PaginationActionsEnum } from '../shared/pagination/pagination.model';
import { UserService } from '../shared/services/user.service';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: AppClient[] = [];
  paginatedClients: AppClient[] = [];

  deleteModalInfo = '';
  clientToDelete: AppClient | undefined;

  paginationActions = new BehaviorSubject<PaginationAction>({
    action: PaginationActionsEnum.PAGINATE
  });

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.clients = this.activatedRoute.snapshot.data[0];
  }

  onPageChanged(paginatedClients: AppClient[]) {
    this.paginatedClients = paginatedClients;
  }

  onDeleteClient(client: AppClient) {
    this.deleteModalInfo = `Are you sure you want to delete ${client.firstName} 
    ${client.lastName} from the database`;
    this.clientToDelete = client;
  }

  onModalSubmit(confirmed: boolean) {
    confirmed ? this.onDeleteConfirm() : this.onDeleteCancel();
  }


  onDeleteConfirm() {
    this.userService.deleteClient(this.clientToDelete!).subscribe(() => {
      this.clients = this.clients.filter(client => client.key !== this.clientToDelete!.key);
      this.paginationActions.next({
        action: PaginationActionsEnum.PAGINATE,
        options: {
          refreshData: this.clients
        }
      });
      this.clientToDelete = undefined;
    });
  }

  onDeleteCancel() {
    this.clientToDelete = undefined;
  }
}
