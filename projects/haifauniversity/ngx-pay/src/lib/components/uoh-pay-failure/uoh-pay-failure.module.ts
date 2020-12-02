import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UohPayFailureContactComponent } from './uoh-pay-failure-contact/uoh-pay-failure-contact.component';
import { UohPayFailureComponent } from './uoh-pay-failure.component';

@NgModule({
  imports: [CommonModule],
  declarations: [UohPayFailureComponent, UohPayFailureContactComponent],
  exports: [UohPayFailureComponent, UohPayFailureContactComponent],
})
export class UohPayFailureModule {}
