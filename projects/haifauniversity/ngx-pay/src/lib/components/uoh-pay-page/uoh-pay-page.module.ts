import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UohPayDialogModule } from '../uoh-pay-dialog/uoh-pay-dialog.module';
import { UohPayPageComponent } from './uoh-pay-page.component';

@NgModule({
  imports: [CommonModule, MatProgressBarModule, UohPayDialogModule],
  declarations: [UohPayPageComponent],
  exports: [UohPayPageComponent],
})
export class UohPayPageModule {}
