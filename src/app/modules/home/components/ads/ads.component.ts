import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';

import { AdsService } from '../../services/ads.service';
import { IAd } from '../../models/ad.model';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {
  ads: IAd[];
  ads$: Observable<IAd[]>;
  filters$: Observable<any>;

  constructor(
    private adsService: AdsService,
  ) {
    this.ads$ = this.adsService.getData();
    this.filters$ = this.adsService.getFilters();
  }

  ngOnInit(): void {
    this.ads$.subscribe((value: IAd[]): void => {
      this.ads = value;
    });

    combineLatest(this.ads$, this.filters$)
      .subscribe(([data, filters]): void => {
        this.ads = this.adsService.getFilteredData(data, filters);
      });
  }
}
