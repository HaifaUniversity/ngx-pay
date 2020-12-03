import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { UohLogger } from '@haifauniversity/ngx-tools';
import { UohPayment } from '../../models/payment.model';
import { UOH_PAY_TYPE_NAME_HE } from '../../models/type.model';

@Component({
  selector: 'uoh-pay-success',
  templateUrl: './uoh-pay-success.component.html',
  styleUrls: ['./uoh-pay-success.component.css'],
})
export class UohPaySuccessComponent implements OnInit {
  types = UOH_PAY_TYPE_NAME_HE;
  @Input() payment: UohPayment;
  @HostBinding('class') class = 'uoh-pay-success';

  constructor(private logger: UohLogger) {}

  ngOnInit(): void {
    this.logger.info('[UohPaySuccessComponent.ngOnInit] Payment success:', JSON.stringify(this.payment));
  }
}
