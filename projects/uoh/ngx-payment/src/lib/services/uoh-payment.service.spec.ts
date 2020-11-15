import { TestBed } from '@angular/core/testing';

import { UohPaymentService } from './uoh-payment.service';

describe('UohPaymentService', () => {
  let service: UohPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UohPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
