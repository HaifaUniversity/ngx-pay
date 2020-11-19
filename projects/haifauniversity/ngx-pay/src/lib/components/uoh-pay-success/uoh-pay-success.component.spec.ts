import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UohPaySuccessComponent } from './uoh-pay-success.component';

describe('UohPaySuccessComponent', () => {
  let component: UohPaySuccessComponent;
  let fixture: ComponentFixture<UohPaySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UohPaySuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UohPaySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
