import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UohPaymentPageComponent } from './uoh-payment-page.component';

describe('UohPaymentPageComponent', () => {
  let component: UohPaymentPageComponent;
  let fixture: ComponentFixture<UohPaymentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UohPaymentPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UohPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
