import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

import { AdFormService } from '../../services/ad-form.service';

@Component({
  selector: 'app-ad-form',
  templateUrl: './ad-form.component.html',
  styleUrls: ['./ad-form.component.scss'],
})
export class AdFormComponent implements OnInit {
  @Output() openSuccessModal = new EventEmitter<void>();
  @Output() hideFormModal = new EventEmitter<void>();

  adForm: FormGroup;
  avatar: string | ArrayBuffer = null;
  rooms = '';
  capacity = '';
  images: {file: File, fileName: string, src: string | ArrayBuffer}[] = [];
  showError = false;

  constructor(
    private formBuilder: FormBuilder,
    private adFormService: AdFormService,
    private modalService: BsModalService,
  ) {
    this.adForm = this.formBuilder.group({
      avatar: [''],
      title: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(100)]],
      rooms: ['', [Validators.required]],
      capacity: ['', [Validators.required, this.capacityValidator.bind(this)]],
      type: ['', [Validators.required]],
      price: ['', [Validators.required, this.priceValidator.bind(this)]],
      address: ['', [Validators.required]],
      timein: ['', [Validators.required]],
      timeout: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnInit() {
  }

  capacityValidator(): {[key: string]: boolean} {
    if (this.adForm) {
      const {capacity, rooms} = this.adForm.controls;
      const capacityValue = capacity.value;
      const roomsValue = rooms.value;

      if (
        +capacityValue === 0 && +roomsValue === 100 ||
        +capacityValue <= +roomsValue
      ) {
        return null;
      }

      return {
        capacity: true,
      };
    }

    return null;
  }

  priceValidator(): {[key: string]: boolean} {
    if (this.adForm) {
      const {type, price} = this.adForm.controls;
      const typeValue = type.value;
      const priceValue = price.value;

      if (
        typeValue === 'bungalo' && +priceValue >= 0 ||
        typeValue === 'flat' && +priceValue >= 1000 ||
        typeValue === 'house' && +priceValue >= 5000
      ) {
        return null;
      }

      return {
        price: true,
      };
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
    return this.showError && !!this.adForm.controls[control].errors;
  }

  onSubmit(evt): boolean {
    const target = evt.target;

    this.showError = true;

    this.adForm.get('capacity').updateValueAndValidity();
    this.adForm.get('price').updateValueAndValidity();

    if (!this.adForm.invalid) {
      const formData = new FormData(target as HTMLFormElement);

      formData.delete('images');

      this.images.forEach((img) => {
        formData.append('images', img.file, img.fileName);
      });

      this.adFormService.postData(formData)
        .subscribe((data: any): void => {
          const subscription: Subscription = this.modalService.onHide.subscribe((): void => {
            this.openSuccessModal.emit();
            subscription.unsubscribe();
          });

          this.hideFormModal.emit();
          this.onReset(target);
        });

      this.showError = false;

      return true;
    }

    return false;
  }

  onReset(form: HTMLFormElement): void {
    form.reset();

    this.showError = false;
    this.avatar = '';
    this.images = [];
  }
}
