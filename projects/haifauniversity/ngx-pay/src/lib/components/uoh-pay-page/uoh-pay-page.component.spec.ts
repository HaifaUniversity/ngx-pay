import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UohPayPageComponent } from './uoh-pay-page.component';

describe('UohPayPageComponent', () => {
  let component: UohPayPageComponent;
  let fixture: ComponentFixture<UohPayPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UohPayPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UohPayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
