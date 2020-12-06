import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface UohPayUnreachableDialogData {
  token: string;
}

@Component({
  selector: 'uoh-pay-unreachable-dialog',
  templateUrl: './uoh-pay-unreachable-dialog.component.html',
  styleUrls: ['./uoh-pay-unreachable-dialog.component.css'],
})
export class UohPayUnreachableDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: UohPayUnreachableDialogData) {}

  ngOnInit(): void {}
}
