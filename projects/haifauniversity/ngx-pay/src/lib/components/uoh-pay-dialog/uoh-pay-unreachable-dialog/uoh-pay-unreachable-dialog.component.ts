import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UohPayContact, UOH_PAY_CONTACT } from '../../../models/contact.model';

export interface UohPayUnreachableDialogData {
  token: string;
}

@Component({
  selector: 'uoh-pay-unreachable-dialog',
  templateUrl: './uoh-pay-unreachable-dialog.component.html',
  styleUrls: ['./uoh-pay-unreachable-dialog.component.css'],
})
export class UohPayUnreachableDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UohPayUnreachableDialogData,
    @Inject(UOH_PAY_CONTACT) public contact: UohPayContact
  ) {}

  ngOnInit(): void {}
}
