import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UohPaySlowConnectionDialogComponent } from './uoh-pay-slow-connection-dialog.component';

describe('UohPaySlowConnectionDialogComponent', () => {
  let component: UohPaySlowConnectionDialogComponent;
  let fixture: ComponentFixture<UohPaySlowConnectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UohPaySlowConnectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UohPaySlowConnectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
