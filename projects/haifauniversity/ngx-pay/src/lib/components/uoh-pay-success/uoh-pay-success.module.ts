import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { UohPaySuccessComponent } from './uoh-pay-success.component';

@NgModule({
  imports: [CommonModule, MatDividerModule],
  declarations: [UohPaySuccessComponent],
  exports: [UohPaySuccessComponent],
})
export class UohPaySuccessModule {}
