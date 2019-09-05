import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

import { AdsService } from '../../services/ads.service';
import { IAd } from '../../models/ad.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  @ViewChild('adFormModal', {static: false})
  adFormModalRef: ModalDirective;

  @ViewChild('successModal', {static: false})
  successModalRef: ModalDirective;

  isDataPosted: boolean;
  ads$: Observable<IAd[]>;

  constructor(
    private adsService: AdsService,
  ) {
    this.ads$ = this.adsService.getData();
  }

  onAdFormHidden(): void {
    if (this.isDataPosted) {
      this.successModalRef.show();
    }

    this.isDataPosted = false;
  }

  onAdFormHide(evt: Event): void {
    const {id} = evt.target as HTMLDivElement;

    if (id === (evt.currentTarget as HTMLDivElement).id) {
      this.adFormModalRef.hide();
    }
  }

  setSuccessStatus(): void {
    this.isDataPosted = true;
  }
}
