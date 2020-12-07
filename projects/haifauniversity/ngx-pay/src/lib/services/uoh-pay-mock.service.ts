import { Injectable, OnDestroy } from '@angular/core';
import { HttpBackend } from '@angular/common/http';
import { UohLogger } from '@haifauniversity/ngx-tools';
import { UohPayConfig, UohPayStatus } from '../models';
import { UohPay } from './uoh-pay.service';
import { Subscription, timer } from 'rxjs';

@Injectable()
export class UohPayMock extends UohPay implements OnDestroy {
  private readonly EVENT_AFTER = 30000;
  private readonly ORIGIN = 'http://localhost:4200';
  private subscription = new Subscription();

  constructor(httpBackend: HttpBackend, logger: UohLogger, config: UohPayConfig) {
    super(httpBackend, logger, config);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  mock(): void {
    this.subscription.add(
      timer(this.EVENT_AFTER).subscribe((_) => {
        const message = UohPayStatus.Pending;
        window.postMessage(message, this.ORIGIN);
      })
    );
  }

  isMessageValid(event: MessageEvent): boolean {
    return true;
  }
}
