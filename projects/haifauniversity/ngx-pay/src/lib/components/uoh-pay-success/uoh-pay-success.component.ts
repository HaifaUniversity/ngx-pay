import { Component, HostBinding, Input } from '@angular/core';
import { UohPayment } from '../../models/payment.model';

@Component({
  selector: 'uoh-pay-success',
  templateUrl: './uoh-pay-success.component.html',
  styleUrls: ['./uoh-pay-success.component.css'],
})
export class UohPaySuccessComponent {
  @Input() payment: UohPayment;
  @HostBinding('class') class = 'uoh-pay-success';

  constructor() {}
}
