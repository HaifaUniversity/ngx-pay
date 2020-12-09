import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UohPayFailureContactComponent } from './uoh-pay-failure-contact.component';

@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [UohPayFailureContactComponent],
  exports: [UohPayFailureContactComponent],
})
export class UohPayFailureContactModule {}
