import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { UohPayment, UohPaymentStatus } from '../../models/payment.model';
import { UohPay } from '../../services/uoh-pay.service';

@Component({
  selector: 'uoh-pay-failure',
  templateUrl: './uoh-pay-failure.component.html',
  styleUrls: ['./uoh-pay-failure.component.css'],
})
export class UohPayFailureComponent implements OnInit {
  payment: UohPayment;
  status = UohPaymentStatus;
  @Input() token: string;
  @HostBinding('class') class = 'uoh-pay-failure';

  constructor(private pay: UohPay) {}

  ngOnInit(): void {
    this.payment = this.pay.payment;
  }
}
