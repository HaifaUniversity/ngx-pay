import { Component, Inject, OnInit } from '@angular/core';
import { UohPayContact, UOH_PAY_CONTACT } from '../../../models/contact.model';

@Component({
  selector: 'uoh-pay-unreachable-dialog',
  templateUrl: './uoh-pay-unreachable-dialog.component.html',
  styleUrls: ['./uoh-pay-unreachable-dialog.component.css'],
})
export class UohPayUnreachableDialogComponent implements OnInit {
  constructor(@Inject(UOH_PAY_CONTACT) public contact: UohPayContact) {}

  ngOnInit(): void {}
}
