import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { PaginationAction, PaginationActionsEnum, PaginationOrder } from '../../shared/pagination/pagination.model';

@Component({
  selector: 'app-client-headers',
  templateUrl: './client-headers.component.html',
  styleUrls: ['./client-headers.component.scss']
})
export class ClientHeadersComponent implements OnInit {
  @Input() paginationActions!: BehaviorSubject<PaginationAction>;

  order: PaginationOrder = "descending";

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onAdd() {
    this.router.navigate(['clients', 'new']);
  }

  onSort() {
    this.paginationActions.next({
      action: PaginationActionsEnum.SORT,
      options: { property: "firstName", order: this.order }
    });
    this.order = this.order === "descending" ? "ascending" : "descending";
  }

  onSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.paginationActions.next({
      action: PaginationActionsEnum.PAGINATE,
      options: {
        itemsPerPage: +target.value
      }
    });
  }
}
