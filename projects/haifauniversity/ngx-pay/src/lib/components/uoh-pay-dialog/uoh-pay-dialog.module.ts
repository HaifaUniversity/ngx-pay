import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UohPayCloseDialogComponent } from './uoh-pay-close-dialog/uoh-pay-close-dialog.component';
import { UohPaySlowConnectionDialogComponent } from './uoh-pay-slow-connection-dialog/uoh-pay-slow-connection-dialog.component';
import { UohPayUnreachableDialogComponent } from './uoh-pay-unreachable-dialog/uoh-pay-unreachable-dialog.component';
import { UohPayFailureContactModule } from '../uoh-pay-failure-contact/uoh-pay-failure-contact.module';
import { UOH_PAY_CONTACT } from '../../models';
import { UOH_PAY_DEFAULT_CONTACT } from '../../config/defaults';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, UohPayFailureContactModule],
  declarations: [UohPayCloseDialogComponent, UohPaySlowConnectionDialogComponent, UohPayUnreachableDialogComponent],
  exports: [UohPayCloseDialogComponent, UohPaySlowConnectionDialogComponent, UohPayUnreachableDialogComponent],
  providers: [{ provide: UOH_PAY_CONTACT, useValue: UOH_PAY_DEFAULT_CONTACT }],
  entryComponents: [UohPayCloseDialogComponent, UohPaySlowConnectionDialogComponent, UohPayUnreachableDialogComponent],
})
export class UohPayDialogModule {}
