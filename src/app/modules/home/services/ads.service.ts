import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { IAd } from '../models/ad.model';

@Injectable()
export class AdsService {
  private subject = new Subject<any>();

  constructor(
    private http: HttpClient,
  ) {}

  getData(): Observable<any> {
    return this.http.get('https://js.dump.academy/keksobooking/data');
  }

  getFilterResult(it: IAd, filters: any): boolean {
    const {offer} = it;

    return Object.keys(offer).every((key: string): boolean => {
      if (filters[key]) {
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
      }

      return true;
    });
  }

  setFilters(filterList: any): void {
    const filters = {...filterList};
    const features = Array.from(filters.features);

    if (features.length) {
      filters.features = [...features];
    } else {
      delete filters.features;
    }

    this.subject.next(filters);
  }

  getFilters(): Observable<any> {
    return this.subject.asObservable();
  }
}
