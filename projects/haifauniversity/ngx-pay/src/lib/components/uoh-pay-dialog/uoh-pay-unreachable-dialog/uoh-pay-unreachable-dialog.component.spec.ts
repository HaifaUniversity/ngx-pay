import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UohPayUnreachableDialogComponent } from './uoh-pay-unreachable-dialog.component';

describe('UohPayUnreachableDialogComponent', () => {
  let component: UohPayUnreachableDialogComponent;
  let fixture: ComponentFixture<UohPayUnreachableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UohPayUnreachableDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UohPayUnreachableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
