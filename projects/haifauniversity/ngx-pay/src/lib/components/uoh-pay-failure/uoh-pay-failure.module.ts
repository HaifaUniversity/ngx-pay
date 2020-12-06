import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UOH_PAY_DEFAULT_CONTACT } from '../../config/defaults';
import { UOH_PAY_CONTACT } from '../../models';
import { UohPayFailureContactModule } from '../uoh-pay-failure-contact/uoh-pay-failure-contact.module';
import { UohPayFailureComponent } from './uoh-pay-failure.component';

@NgModule({
  imports: [CommonModule, UohPayFailureContactModule],
  declarations: [UohPayFailureComponent],
  exports: [UohPayFailureComponent],
  providers: [{ provide: UOH_PAY_CONTACT, useValue: UOH_PAY_DEFAULT_CONTACT }],
})
export class UohPayFailureModule {}
