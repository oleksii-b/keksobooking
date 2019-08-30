import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home/home-page.component';
import { AdFormComponent } from './components/ad-form/ad-form.component';
import { AdFormService } from './services/ad-form.service';
import { AdsService } from './services/ads.service';
import { AdsComponent } from './components/ads/ads.component';
import { FeaturesComponent } from './components/features/features.component';
import { FiltersComponent } from './components/filters/filters.component';


@NgModule({
  declarations: [
    HomePageComponent,
    AdFormComponent,
    AdsComponent,
    FeaturesComponent,
    FiltersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HomeRoutingModule,
    ModalModule.forRoot(),
  ],
  providers: [
    AdFormService,
    AdsService,
  ]
})
export class HomeModule {}
