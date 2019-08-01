import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';

import { AdsService } from '../../services/ads.service';
import { IAd } from '../../models/ad.model';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {
  ads: IAd[];

  constructor(
    private adsService: AdsService,
  ) {}

  ngOnInit(): void {
    this.adsService.getData().subscribe((value: IAd[]): void => {
      this.ads = value;
    });

    combineLatest(this.adsService.getData(), this.adsService.getFilters())
      .subscribe((value: [IAd[], any]): void => {
        this.ads = value[0].filter((it: IAd): boolean => {
          return this.adsService.getFilterResult(it, value[1]);
        });
      });
  }
}
