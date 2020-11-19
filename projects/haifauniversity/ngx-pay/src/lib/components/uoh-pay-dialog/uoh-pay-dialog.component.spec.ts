import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UohPayDialogComponent } from './uoh-pay-dialog.component';

describe('UohPayDialogComponent', () => {
  let component: UohPayDialogComponent;
  let fixture: ComponentFixture<UohPayDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UohPayDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UohPayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
