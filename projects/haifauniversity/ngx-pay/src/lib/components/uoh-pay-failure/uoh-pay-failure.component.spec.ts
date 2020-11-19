import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UohPayFailureComponent } from './uoh-pay-failure.component';

describe('UohPayFailureComponent', () => {
  let component: UohPayFailureComponent;
  let fixture: ComponentFixture<UohPayFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UohPayFailureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UohPayFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
