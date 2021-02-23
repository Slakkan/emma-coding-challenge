import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PaginationAction, PaginationActionOptions, PaginationActionsEnum, PaginationFiltersEnum } from './pagination.model';
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

  appliedFilters: { id: string, type: PaginationFiltersEnum; options: PaginationActionOptions; }[] = [];
  filteredArray: T[] = [];

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
    if (options?.refreshData) {
      this.array = options.refreshData;
    }
    if (action === PaginationActionsEnum.PAGINATE) {
      if (options?.itemsPerPage) {
        this.itemsPerPage = options.itemsPerPage;
      }
      this.paginate();
    }
    else if (action === PaginationActionsEnum.SORT) {
      if (options && options.property) {
        this.array = this.paginationService.sortStrings(this.array, options.property, options.order);
        this.applyFilters();
      } else {
        throw new Error("THIS ACTION REQUIERS OPTIONS: property");
      }
    } else if (action === PaginationActionsEnum.ADD_FILTER) {
      if (options && options.filterId && options.filterType && options.property && options.value) {
        this.addFilter(options);
      } else {
        throw new Error("THIS ACTION REQUIERS OPTIONS: filterId, filterType, property, value");
      }
    } else if (action === PaginationActionsEnum.REMOVE_FILTER) {
      if (options && options.filterId) {
        this.removeFilter(options.filterId);
      } else {
        throw new Error("THIS ACTION REQUIERS OPTION: filterId");
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

  addFilter(options: PaginationActionOptions) {
    const isIdUnique = !this.appliedFilters.find(filter => filter.id === options.filterId);
    if (!isIdUnique) {
      throw new Error(`Filter with id: ${options.filterId} already exists!`);
    }
    this.appliedFilters.push({ id: options.filterId!, type: options.filterType!, options });
    this.applyFilters();
  }

  removeFilter(id: string) {
    this.appliedFilters = this.appliedFilters.filter(filter => filter.id !== id);
    this.applyFilters();
  }

  applyFilters() {
    let array = [...this.array];
    this.appliedFilters.forEach(filter => {
      if (filter.type === PaginationFiltersEnum.FILTER_PROPERTY_EQUALS_VALUE) {
        const { property, value } = filter.options;
        if (property && value) {
          array = this.paginationService.filterPropertyEqualsValue(array, property, value);
        } else {
          throw new Error("You need to supply property and value options for this filter");
        }
      } else if (filter.type === PaginationFiltersEnum.FILTER_STRING_INCLUDES_VALUE) {
        const { property, value } = filter.options;
        if (property && value) {
          array = this.paginationService.filterStringIncludesValue(array, property, value);
        } else {
          throw new Error("You need to supply property and value options for this filter");
        }
      }
    });
    this.filteredArray = array;
    this.paginate();
  }

  paginate() {
    const array = this.appliedFilters.length ? [...this.filteredArray] : [...this.array];
    const len = array.length;
    const ipp = this.itemsPerPage;
    const pages = len === 0 ? 0 : Math.floor((len - 1) / ipp);

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
