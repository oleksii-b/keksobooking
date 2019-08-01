import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  modalRef: BsModalRef;
  successModalRef: BsModalRef;

  @ViewChild('successModal', {static: false})
  successModal: TemplateRef<any>;

  constructor(
    private modalService: BsModalService,
  ) {}

  openAdFormModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  openSuccessModal(): void {
    this.successModalRef = this.modalService.show(this.successModal);
  }
}
