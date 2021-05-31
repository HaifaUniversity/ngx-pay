import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { UohLogger } from '@haifauniversity/ngx-tools';
import { UohPayContact, UOH_PAY_CONTACT } from '../../models/contact.model';
import { UohPayment } from '../../models/payment.model';
import { UohPayStatus } from '../../models/status.model';

@Component({
  selector: 'uoh-pay-failure',
  templateUrl: './uoh-pay-failure.component.html',
  styleUrls: ['./uoh-pay-failure.component.css'],
})
export class UohPayFailureComponent implements OnInit {
  status = UohPayStatus;
  /**
   * The payment details.
   */
  @Input() payment: UohPayment;
  /**
   * The payment token.
   */
  @Input() token: string;
  @HostBinding('class') class = 'uoh-pay-failure';

  constructor(private logger: UohLogger, @Inject(UOH_PAY_CONTACT) public contact: UohPayContact) {}

  ngOnInit(): void {
    this.logger.error(
      `[UohPayFailureComponent.ngOnInit] Payment failed for token ${this.token} with status ${this.payment.status}.`
    );
  }
}
