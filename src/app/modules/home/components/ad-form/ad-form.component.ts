import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

import { AdFormService } from '../../services/ad-form.service';

@Component({
  selector: 'app-ad-form',
  templateUrl: './ad-form.component.html',
  styleUrls: ['./ad-form.component.scss'],
})
export class AdFormComponent {
  @Output() openSuccessModal = new EventEmitter<void>();
  @Output() hideFormModal = new EventEmitter<void>();

  adForm: FormGroup;
  avatar: string | ArrayBuffer = null;
  rooms = '';
  capacity = '';
  images: {file: File, fileName: string, src: string | ArrayBuffer}[] = [];
  showErrors = false;
  priceErrors = null;
  capacityErrors = null;

  constructor(
    private formBuilder: FormBuilder,
    private adFormService: AdFormService,
    private modalService: BsModalService,
  ) {
    this.adForm = this.formBuilder.group({
      avatar: [''],
      title: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(100)]],
      rooms: ['', [Validators.required]],
      capacity: ['', [Validators.required, this.capacityValidator]],
      type: ['', [Validators.required]],
      price: ['', [Validators.required, this.priceValidator]],
      address: ['', [Validators.required]],
      timein: ['', [Validators.required]],
      timeout: ['', [Validators.required]],
      description: [''],
    });
  }

  capacityValidator(formControl: FormControl): {[key: string]: string} {
    const form = formControl.parent as FormGroup;

    if (form) {
      const {capacity, rooms} = form.controls;
      const capacityValue = +capacity.value;
      const roomsValue = +rooms.value;

      if (capacityValue && roomsValue === 100) {
        return {
          value: 'Для жилья с кол-вом комнат более трех следует указать более трех гостей',
        };
      }

      if (capacityValue > roomsValue) {
        return {
          value: 'Кол-во гостей не должно превышать кол-ва комнат',
        };
      }

      return null;
    }
  }

  priceValidator(formControl: FormControl): {[key: string]: string} {
    const form = formControl.parent as FormGroup;

    if (form) {
      const {type, price} = form.controls;
      const typeValue = type.value;
      const priceValue = +price.value;
      const maxPrice = 1000000;
      const minPrice = {
        bungalo: 0,
        flat: 1000,
        house: 5000,
      };

      if (typeValue && price.value) {
        if (isFinite(priceValue)) {
          if (priceValue > maxPrice) {
            return {
              value: `Максималная цена жилья ${maxPrice} руб.`,
            };
          }

          if (priceValue < minPrice[typeValue]) {
            switch (typeValue) {
              case 'bungalo':
                return {
                  value: `Минимальная цена эконом-варианта ${minPrice[typeValue]} руб.`,
                };

              case 'flat':
                return {
                  value: `Минимальная цена картиры ${minPrice[typeValue]} руб.`,
                };

              case 'house':
                return {
                  value: `Минимальная цена дома ${minPrice[typeValue]} руб.`,
                };
            }
          }

          return null;
        }

        return {
          value: 'Только числовые значения',
        };
      }

      return null;
    }

    return null;
  }

  onAvatarLoad(evt: Event): void {
    const input = evt.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const reader: FileReader = new FileReader();

      reader.readAsDataURL(input.files[0]);
      reader.addEventListener('load', (e: Event) => {
        this.avatar = (e.target as FileReader).result;
      });
    }
  }

  onImageLoad(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const formData = new FormData(input.form);
    const files: any = input.files;

    formData.append('images', files[0], input.value);

    if (input.files && input.files[0]) {
      const reader: FileReader = new FileReader();

      reader.readAsDataURL(input.files[0]);
      reader.addEventListener('load', (e: Event) => {
        this.images.push({
          file: input.files[0],
          fileName: input.value,
          src: (e.target as FileReader).result,
        });
      });
    }
  }

  showErrorMsg(control: string): boolean {
    return this.showErrors && !!this.adForm.controls[control].errors;
  }

  updateValuesAndValidity(): void {
    this.adForm.get('capacity').updateValueAndValidity();
    this.adForm.get('price').updateValueAndValidity();

    this.priceErrors = this.adForm.controls.price.errors;
    this.capacityErrors = this.adForm.controls.capacity.errors;
  }

  onSubmit(evt): boolean {
    const target = evt.target;

    this.showErrors = true;

    this.updateValuesAndValidity();

    if (!this.adForm.invalid) {
      const formData = new FormData(target as HTMLFormElement);

      formData.delete('images');

      this.images.forEach((img) => {
        formData.append('images', img.file, img.fileName);
      });

      this.adFormService.postData(formData)
        .subscribe((data): void => {
          const subscription: Subscription = this.modalService.onHide.subscribe((): void => {
            this.openSuccessModal.emit();
            subscription.unsubscribe();
          });

          this.hideFormModal.emit();
          this.onReset(target);
        });

      this.showErrors = false;

      return true;
    }

    return false;
  }

  onReset(form: HTMLFormElement): void {
    this.updateValuesAndValidity();
    form.reset();

    this.showErrors = false;
    this.avatar = '';
    this.images = [];
  }
}
