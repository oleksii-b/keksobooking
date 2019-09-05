import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, fromEvent, combineLatest } from 'rxjs';

import { AdsService } from '../../services/ads.service';
import { FilterService } from '../../services/filter.service';
import { ISelectedFilter } from '../../models/filter.model';

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
  filters;
  selectedFilters$: Observable<ISelectedFilter[]>;

  constructor(
    private formBuilder: FormBuilder,
    private adsService: AdsService,
    private filterService: FilterService,
  ) {
    this.features = formBuilder.group({
      wifi: [false],
      dishwasher: [false],
      parking: [false],
      washer: [false],
      elevator: [false],
      conditioner: [false],
    });

    this.form = this.formBuilder.group({
      type: [''],
      price: [''],
      rooms: [''],
      guests: [''],
      features: this.features,
    });

    this.filters = {};
    this.selectedFilters$ = this.filterService.get();
  }

  ngAfterViewInit(): void {
    let timeOut;

    combineLatest(
      fromEvent(this.formRef.nativeElement, 'change'),
      this.form.valueChanges,
    )
      .subscribe(([evt, formValues]): void => {
        this.setFilters((evt as Event).target);

        const filters = {...this.filters};
        const features = Object.keys(formValues.features);
        const selectedFeatures = features.filter((it: string): boolean => formValues.features[it]);

        if (features.length) {
          filters.features = selectedFeatures;
        }

        this.filterService.set(filters);

        if (timeOut) {
          clearTimeout(timeOut);
        }

        timeOut = setTimeout((): void => {
          this.adsService.setFilters(filters);
        }, 500);
      });
  }

  setFilters(target): void {
    const {selectedOptions} = target;

    let {value} = target;

    if (target.name !== 'features') {
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
          value,
        };
      }
    }
  }

  onClearFilter(filter: string): void {
    delete this.filters[filter];

    this.form.controls[filter].setValue('');
  }

  onClearFeature(feature: string): void {
    (this.form.controls.features as FormGroup).controls[feature].setValue(false);
  }

  onToggleFilters(): void {
    this.visibility = !this.visibility;

    document.body.classList.toggle('modal-open', this.visibility);
  }
}
