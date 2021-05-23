import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UohPayDialogModule } from '../uoh-pay-dialog/uoh-pay-dialog.module';
import { UohPayPageComponent } from './uoh-pay-page.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatProgressBarModule, UohPayDialogModule, MaterialModule],
  declarations: [UohPayPageComponent],
  exports: [UohPayPageComponent],
})
export class UohPayPageModule {}
