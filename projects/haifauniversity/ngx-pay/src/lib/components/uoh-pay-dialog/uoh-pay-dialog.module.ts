import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UohPayDialogComponent } from './uoh-pay-dialog.component';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  declarations: [UohPayDialogComponent],
  exports: [UohPayDialogComponent],
  entryComponents: [UohPayDialogComponent],
})
export class UohPayDialogModule {}
