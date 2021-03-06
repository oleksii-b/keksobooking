import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IFeature } from '../../models/ad.model';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {
  @Input() formGroup?: FormGroup;

  features: IFeature[] = [
    {
      name: 'wifi',
      title: 'Wi-Fi',
    },
    {
      name: 'dishwasher',
      title: 'Посудомоечная машина',
    },
    {
      name: 'parking',
      title: 'Парковка',
    },
    {
      name: 'washer',
      title: 'Стиральная машина',
    },
    {
      name: 'elevator',
      title: 'Лифт',
    },
    {
      name: 'conditioner',
      title: 'Кондиционер',
    },
  ];

  onChange(feature): void {
    feature.checked = !feature.checked;
  }
}
