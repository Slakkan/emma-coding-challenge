
export interface PaginationAction {
  action: PaginationActionsEnum,
  options?: PaginationActionOptions;
}

export enum PaginationActionsEnum {
  "PAGINATE" = 1,
  "SORT",
  "ADD_FILTER",
  "REMOVE_FILTER"
}

export enum PaginationFiltersEnum {
  "FILTER_PROPERTY_EQUALS_VALUE" = 1,
  "FILTER_STRING_INCLUDES_VALUE"
}

export interface PaginationActionOptions {
  // GENERAL
  property?: string;
  itemsPerPage?: number;
  // SORT
  order?: PaginationOrder;
  // FILTER
  filterId?: string;
  filterType?: PaginationFiltersEnum;
  value?: any;
}

export type PaginationOrder = "ascending" | "descending" | undefined;
