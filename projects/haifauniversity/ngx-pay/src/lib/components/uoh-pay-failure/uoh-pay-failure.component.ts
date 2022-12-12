import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { UohLogger } from '@haifauniversity/ngx-tools';
import { UohPayContact, UOH_PAY_CONTACT } from '../../models/contact.model';
import { UohPayment } from '../../models/payment.model';
import { errorCods, errorCodsENG, UohPayStatus } from '../../models/status.model';

@Component({
  selector: 'uoh-pay-failure',
  templateUrl: './uoh-pay-failure.component.html',
  styleUrls: ['./uoh-pay-failure.component.css'],
})
export class UohPayFailureComponent implements OnInit {
  status = UohPayStatus;
  errors = errorCods;
  errorsEN = errorCodsENG;
  /**
   * The payment details.
   */
  @Input() payment: UohPayment;
  /**
   * The payment token.
   */
  @Input() token: string;
  @Input() lang: string="he";
  @HostBinding('class') class = 'uoh-pay-failure';
  error: any;

  constructor(private logger: UohLogger, @Inject(UOH_PAY_CONTACT) public contact: UohPayContact) { }

  ngOnInit(): void {
    if(this.lang=='en'){
      this.error = this.errorsEN.find(x => x.key == this.payment.creditResponse)?.value;
     // this.error = this.error != null && this.error != undefined ? this.error : '';
    }
    else{
      this.error = this.errors.find(x => x.key == this.payment.creditResponse)?.value;
    
    }
    this.error = this.error != null && this.error != undefined ? this.error : '';
    this.logger.error(
      `[UohPayFailureComponent.ngOnInit] Payment failed for token ${this.token} with status ${this.payment.status}.`
    );
  }
}
