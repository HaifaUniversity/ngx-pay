import { Component, HostBinding, Input } from '@angular/core';
import { UohPayment } from '../../models/payment.model';
import { UohPayStatus } from '../../models/status.model';

@Component({
  selector: 'uoh-pay-failure',
  templateUrl: './uoh-pay-failure.component.html',
  styleUrls: ['./uoh-pay-failure.component.css'],
})
export class UohPayFailureComponent {
  status = UohPayStatus;
  @Input() payment: UohPayment;
  @Input() token: string;
  @HostBinding('class') class = 'uoh-pay-failure';

  constructor() {}
}
