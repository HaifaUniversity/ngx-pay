import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UohPayment } from '../../models/payment.model';
import { UohPay } from '../../services/uoh-pay.service';

@Component({
  selector: 'uoh-pay-success',
  templateUrl: './uoh-pay-success.component.html',
  styleUrls: ['./uoh-pay-success.component.css'],
})
export class UohPaySuccessComponent implements OnInit {
  payment$: Observable<UohPayment>;
  @HostBinding('class') class = 'uoh-pay-success';

  constructor(private pay: UohPay) {}

  ngOnInit(): void {
    this.payment$ = this.pay.payment$;
  }
}
