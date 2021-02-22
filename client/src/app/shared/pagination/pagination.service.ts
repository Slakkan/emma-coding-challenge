import { Injectable } from '@angular/core';
import { PaginationOrder } from './pagination.model';

@Injectable()
export class PaginationService {

  constructor() { }

  sortStrings(array: any[], property: string, order: PaginationOrder) {
    const isDescending = order === "descending";
    const newArray = [...array];
    newArray.sort((a, b) => {
      const A = a[property].toUpperCase();
      const B = b[property].toUpperCase();
      if ((isDescending && A < B) || (!isDescending && A > B)) {
        return -1;
      } else if ((isDescending && A > B) || (!isDescending && A < B)) {
        return 1;
      } else {
        return 0;
      }
    });
    return newArray;
  }

  filterPropertyEqualsValue(array: any[], property: string, value: any) {
    return array.filter(item => item[property] === value);
  }

  filterStringIncludesValue(array: any[], property: string, value: string) {
    const valueLowerCase = value.toLowerCase();
    return array.filter(item => (item[property] as string).toLowerCase().includes(valueLowerCase));
  }
}
