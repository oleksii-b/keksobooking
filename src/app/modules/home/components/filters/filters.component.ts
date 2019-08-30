import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { fromEvent, combineLatest } from 'rxjs';

import { AdsService } from '../../services/ads.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements AfterViewInit {
  @ViewChild('filterForm', {static: false})
  formRef: ElementRef;

  visibility: boolean;
  form: FormGroup;
  features: FormGroup;

  filters = {
    features: new Set(),
  };

  selectedFilters: Array<unknown> = [];

  constructor(
    private formBuilder: FormBuilder,
    private adsService: AdsService,
  ) {
    this.features = formBuilder.group({
      wifi: [false],
      dishwasher: [false],
      parking: [false],
      washer: [false],
      elevator: [false],
      conditioner: [false],
    })

    this.form = this.formBuilder.group({
      type: [''],
      price: [''],
      rooms: [''],
      guests: [''],
      features: this.features
    });
  }

  ngAfterViewInit(): void {
    combineLatest(
      fromEvent(this.formRef.nativeElement, 'change'),
      this.form.valueChanges,
    )
      .subscribe(([evt]): void => {
        this.setFilters((evt as Event).target);

        const filters = {...this.filters};
        const features = [...filters.features.values()];

        delete filters.features;

        this.selectedFilters = Object.keys(filters);

        if (features.length) {
          this.selectedFilters.push(features);
        }

        this.adsService.setFilters(this.filters);
      });
  }

  setFilters(target): void {
    let {value, selectedOptions} = target;

    if (target.name === 'features') {
      if (target.checked) {
        this.filters[target.name].add(value);
      } else {
        this.filters[target.name].delete(value);
      }
    } else {
      if (!value) {
        delete this.filters[target.name];
      } else {
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

        this.filters[target.name] = {
          text: selectedOptions[0].innerText,
          value
        };
      }
    }
  }

  onClearFilter(filter: string): void {
    delete this.filters[filter];

    this.form.controls[filter].setValue('');
  }

  onClearFeature(feature: string): void {
    this.filters.features.delete(feature);
    (this.form.controls.features as FormGroup).controls[feature].setValue(false);
  }

  onToggleFilters(): void {
    this.visibility = !this.visibility;

    document.body.classList.toggle('modal-open', this.visibility);
  }
}
