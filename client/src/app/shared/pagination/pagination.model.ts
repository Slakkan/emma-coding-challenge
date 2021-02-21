
export interface PaginationAction {
  action: PaginationActionsEnum,
  options?: PaginationActionOptions;
}

export enum PaginationActionsEnum {
  "PAGINATE",
  "SORT"
}

export interface PaginationActionOptions {
  property?: string;
  order?: PaginationOrder
  itemsPerPage?: number
}

export type PaginationOrder = "ascending" | "descending" | undefined
