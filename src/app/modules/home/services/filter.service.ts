import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { ISelectedFilter } from '../models/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private selectedFilters$ = new BehaviorSubject<ISelectedFilter[]>([]);

  get(): Observable<ISelectedFilter[]> {
    return this.selectedFilters$.asObservable();
  }

  set(filters): void {
    const selectedFilters = Object.keys(filters).map((it: string) => {
      const filter: ISelectedFilter = {name: it};
      const filterData = filters[it];

      if (Array.isArray(filterData) && filterData.length) {
        filter.values = filterData;
      } else {
        Object.assign(filter, filterData);
      }

      return filter;
    });

    this.selectedFilters$.next(selectedFilters);
  }
}
