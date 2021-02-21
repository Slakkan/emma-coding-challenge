import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PaginationAction, PaginationActionOptions, PaginationActionsEnum } from './pagination.model';
import { PaginationService } from './pagination.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  providers: [PaginationService]
})
export class PaginationComponent<T> implements OnInit, OnDestroy {
  @Input() array: T[] = [];
  @Input() actions!: BehaviorSubject<PaginationAction>;

  paginatedItems: T[][] = [];
  itemsPerPage = 5;

  currentPage = 0;
  lastPage = 0;

  isPrevDisabled = true;
  isNextDisabled = true;

  prevPage = '';
  nextPage = '';

  trailingDotsPrev = '';
  trailingDotsNext = '';

  subscriptions: Subscription[] = [];

  @Output() pageChanged = new EventEmitter<T[]>();

  constructor(private paginationService: PaginationService) { }

  ngOnInit(): void {
    const actionsSub = this.actions.subscribe(({ action, options }) => this.onAction(action, options));
    this.subscriptions.push(actionsSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onAction(action: PaginationActionsEnum, options?: PaginationActionOptions) {
    if (action === PaginationActionsEnum.PAGINATE) {
      if (options?.itemsPerPage) {
        this.itemsPerPage = options.itemsPerPage;
      }
      this.paginate();
    }
    else if (action === PaginationActionsEnum.SORT) {
      if (options && options.property) {
        this.array = this.paginationService.sortStrings(this.array, options.property, options.order);
        this.paginate();
      } else {
        throw new Error("THE ACTION SORT REQUIERS THE PROPERTY OPTION");
      }
    }
  }

  onNextPage() {
    if (!this.isNextDisabled) {
      this.currentPage++;
      this.checkDisablesAndEmit();
    }
  }

  onGoToLast() {
    if (!this.isNextDisabled) {
      this.currentPage = this.lastPage;
      this.checkDisablesAndEmit();
    }
  }

  onPrevPage() {
    if (!this.isPrevDisabled) {
      this.currentPage--;
      this.checkDisablesAndEmit();
    }
  }

  onGoToFirst() {
    if (!this.isPrevDisabled) {
      this.currentPage = 0;
      this.checkDisablesAndEmit();
    }
  }

  checkDisablesAndEmit() {
    this.isPrevDisabled = this.currentPage === 0;
    this.isNextDisabled = this.currentPage === this.lastPage;
    this.prevPage = this.isPrevDisabled ? '' : '' + (this.currentPage - 1);
    this.nextPage = this.isNextDisabled ? '' : '' + (this.currentPage + 1);
    this.trailingDotsPrev = this.currentPage - 1 > 0 ? '...' : '';
    this.trailingDotsNext = this.currentPage + 1 < this.lastPage ? '...' : '';
    this.pageChanged.emit(this.paginatedItems[this.currentPage]);
  }

  paginate() {
    const array = [...this.array];
    const len = array.length;
    const ipp = this.itemsPerPage;
    const pages = Math.floor((len - 1) / ipp);

    let paginatedArray: T[][] = [];
    for (let i = 0; i <= pages; i++) {
      let page;
      if (array.length > ipp) {
        page = array.splice(0, ipp);
      } else {
        page = array;
      }
      paginatedArray.push(page);
    }

    this.lastPage = pages;
    this.paginatedItems = paginatedArray;
    this.checkDisablesAndEmit();
  }
}
