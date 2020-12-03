import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UohPayCloseDialogComponent } from './uoh-pay-close-dialog/uoh-pay-close-dialog.component';
import { UohPaySlowConnectionDialogComponent } from './uoh-pay-slow-connection-dialog/uoh-pay-slow-connection-dialog.component';
import { UohPayUnreachableDialogComponent } from './uoh-pay-unreachable-dialog/uoh-pay-unreachable-dialog.component';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  declarations: [UohPayCloseDialogComponent, UohPaySlowConnectionDialogComponent, UohPayUnreachableDialogComponent],
  exports: [UohPayCloseDialogComponent, UohPaySlowConnectionDialogComponent, UohPayUnreachableDialogComponent],
  entryComponents: [UohPayCloseDialogComponent, UohPaySlowConnectionDialogComponent, UohPayUnreachableDialogComponent],
})
export class UohPayDialogModule {}
