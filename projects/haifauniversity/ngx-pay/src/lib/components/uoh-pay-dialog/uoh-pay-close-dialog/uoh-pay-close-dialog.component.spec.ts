import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UohPayCloseDialogComponent } from './uoh-pay-close-dialog.component';

describe('UohPayCloseDialogComponent', () => {
  let component: UohPayCloseDialogComponent;
  let fixture: ComponentFixture<UohPayCloseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UohPayCloseDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UohPayCloseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
