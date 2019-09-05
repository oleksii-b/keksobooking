import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { IAd } from '../models/ad.model';

@Injectable()
export class AdsService {
  private filters$ = new BehaviorSubject<any>({});

  constructor(
    private http: HttpClient,
  ) {}

  getData(): Observable<any> {
    return this.http.get('https://js.dump.academy/keksobooking/data');
  }

  getFilteredData(data: IAd[], filters: any): IAd[] {
    const namesOfFilters = Object.keys(filters);

    return data.filter((it: IAd): boolean => {
      const {offer} = it;

      return namesOfFilters.every((key: string): boolean => {
        if (offer[key]) {
          if (key === 'features') {
            const hasFeatures = filters[key].every((feature: string): boolean => {
              return (new Set(offer.features)).has(feature);
            });

            if (!hasFeatures) {
              return false;
            }
          } else if (key === 'price') {
            const {price} = offer;
            const minPrice = filters[key].min;
            const maxPrice = filters[key].max;

            if (price < minPrice || (maxPrice && price > maxPrice)) {
              return false;
            }
          } else {
            if (filters[key] !== `${offer[key]}`) {
              return false;
            }
          }

          return true;
        }

        return false;
      });
    });
  }

  setFilters(filterList: any): void {
    const {features} = filterList;
    const filters = {features};

    Object.keys(filterList).forEach((key: string): void => {
      if (key === 'features') {
        if (filters.features) {
          const {features} = filters;

          if (features.length) {
            filters.features = [...features];
          } else {
            delete filters.features;
          }
        }
      } else {
        filters[key] = filterList[key].value;
      }
    });

    this.filters$.next(filters);
  }

  getFilters(): Observable<any> {
    return this.filters$.asObservable();
  }
}
