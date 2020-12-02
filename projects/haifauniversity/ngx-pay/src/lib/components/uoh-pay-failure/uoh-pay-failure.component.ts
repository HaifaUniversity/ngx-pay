import { Component, HostBinding, Input } from '@angular/core';
import { UohPayContact } from '../../models/contact.model';
import { UohPayment } from '../../models/payment.model';
import { UohPayStatus } from '../../models/status.model';

@Component({
  selector: 'uoh-pay-failure',
  templateUrl: './uoh-pay-failure.component.html',
  styleUrls: ['./uoh-pay-failure.component.css'],
})
export class UohPayFailureComponent {
  mailto: string;
  status = UohPayStatus;
  /**
   * The payment details.
   */
  @Input() payment: UohPayment;
  /**
   * The payment token.
   */
  @Input() token: string;
  /**
   * [Optional] A contact to which the user can send error messages.
   */
  @Input() contact: UohPayContact;
  @HostBinding('class') class = 'uoh-pay-failure';

  constructor() {}
}
