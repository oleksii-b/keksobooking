import { TestBed } from '@angular/core/testing';

import { AdFormService } from './ad-form.service';

describe('AdFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdFormService = TestBed.get(AdFormService);
    expect(service).toBeTruthy();
  });
});
