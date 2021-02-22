import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { PaginationAction, PaginationActionsEnum, PaginationFiltersEnum, PaginationOrder } from '../../shared/pagination/pagination.model';

@Component({
  selector: 'app-client-headers',
  templateUrl: './client-headers.component.html',
  styleUrls: ['./client-headers.component.scss']
})
export class ClientHeadersComponent implements OnInit, OnDestroy {
  @Input() paginationActions!: BehaviorSubject<PaginationAction>;

  searchInput: Subject<Event> = new Subject();
  order: PaginationOrder = "descending";
  viewInactive = true;

  viewInactiveIcon = "/assets/icons/visibility_off-24px.svg";
  viewOnlyActiveIcon = "/assets/icons/visibility-24px.svg";

  subscriptions: Subscription[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    const searchSub = this.searchInput.pipe(
      debounceTime(200),
      map(e => (e.target as HTMLInputElement).value)
    ).subscribe((value) => this.onSearch(value));
    this.subscriptions.push(searchSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onAdd() {
    this.router.navigate(['clients', 'new']);
  }

  onSearch(value: string) {
    this.paginationActions.next({
      action: PaginationActionsEnum.REMOVE_FILTER,
      options: {
        filterId: "hasName"
      }
    });
    if (value) {
      this.paginationActions.next({
        action: PaginationActionsEnum.ADD_FILTER,
        options: {
          filterType: PaginationFiltersEnum.FILTER_STRING_INCLUDES_VALUE,
          filterId: "hasName",
          property: "firstName",
          value: value
        }
      });
    }
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

  onViewInactive() {
    this.viewInactive = !this.viewInactive;
    if (this.viewInactive) {
      this.paginationActions.next({
        action: PaginationActionsEnum.REMOVE_FILTER,
        options: {
          filterId: "viewActive"
        }
      });
    } else {
      this.paginationActions.next({
        action: PaginationActionsEnum.ADD_FILTER,
        options: {
          filterType: PaginationFiltersEnum.FILTER_PROPERTY_EQUALS_VALUE,
          filterId: "viewActive",
          property: "isActive",
          value: true
        }
      });
    }
  }
}
