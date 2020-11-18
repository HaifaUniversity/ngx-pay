import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UohPaymentDialogComponent } from './uoh-payment-dialog.component';

describe('UohPaymentDialogComponent', () => {
  let component: UohPaymentDialogComponent;
  let fixture: ComponentFixture<UohPaymentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UohPaymentDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UohPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
