import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { UohPayFailureComponent } from './uoh-pay-failure.component';

@NgModule({
  imports: [CommonModule, MatDividerModule],
  declarations: [UohPayFailureComponent],
  exports: [UohPayFailureComponent],
})
export class UohPayFailureModule {}
