import { Component } from '@angular/core';

import { AdsService } from '../../services/ads.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  filters = {
    features: new Set(),
  };

  constructor(
    private adsService: AdsService,
  ) { }

  onSetFilters(evt): void {
    const target = evt.target;

    if (target.name === 'features') {
      if (target.checked) {
        this.filters[target.name].add(target.value);
      } else {
        this.filters[target.name].delete(target.value);
      }
    } else {
      if (target.value === 'any') {
        delete this.filters[target.name];
      } else {
        let value = target.value;

        if (target.name === 'price') {
          switch (value) {
            case 'low':
              value = {
                min: 0,
                max: 10000,
              };
              break;
            case 'middle':
              value = {
                min: 10000,
                max: 50000,
              };
              break;
            case 'high':
              value = {
                min: 50000,
              };
              break;
          }
        }

        this.filters[target.name] = value;
      }
    }

    this.adsService.setFilters(this.filters);
  }
}
