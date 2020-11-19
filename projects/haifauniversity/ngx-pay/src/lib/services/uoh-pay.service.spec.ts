import { TestBed } from '@angular/core/testing';

import { UohPay } from './uoh-pay.service';

describe('UohPay', () => {
  let service: UohPay;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UohPay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
