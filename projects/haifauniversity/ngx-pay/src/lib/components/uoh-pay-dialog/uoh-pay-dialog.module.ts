import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UohPayCloseDialogComponent } from './uoh-pay-close-dialog/uoh-pay-close-dialog.component';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  declarations: [UohPayCloseDialogComponent],
  exports: [UohPayCloseDialogComponent],
  entryComponents: [UohPayCloseDialogComponent],
})
export class UohPayDialogModule {}
