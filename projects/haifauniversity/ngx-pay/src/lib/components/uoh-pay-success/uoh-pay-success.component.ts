import { Component, HostBinding, Input } from '@angular/core';
import { UohPayment } from '../../models/payment.model';
import { UOH_PAY_TYPE_NAME_HE } from '../../models/type.model';

@Component({
  selector: 'uoh-pay-success',
  templateUrl: './uoh-pay-success.component.html',
  styleUrls: ['./uoh-pay-success.component.css'],
})
export class UohPaySuccessComponent {
  types = UOH_PAY_TYPE_NAME_HE;
  @Input() payment: UohPayment;
  @HostBinding('class') class = 'uoh-pay-success';

  constructor() {}
}
