import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home/home-page.component';
import { AdFormComponent } from './components/ad-form/ad-form.component';
import { AdFormService } from './services/ad-form.service';
import { AdsService } from './services/ads.service';
import { AdsComponent } from './components/ads/ads.component';
import { FeaturesComponent } from './components/features/features.component';
import { FiltersComponent } from './components/filters/filters.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    HomePageComponent,
    AdFormComponent,
    AdsComponent,
    FeaturesComponent,
    FiltersComponent,
  ],
  imports: [
    HomeRoutingModule,
    ModalModule.forRoot(),
    SharedModule.forRoot(),
  ],
  providers: [
    AdFormService,
    AdsService,
  ]
})
export class HomeModule {}
