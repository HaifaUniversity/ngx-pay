import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UohLogger } from '@haifauniversity/ngx-tools';
import { BehaviorSubject, Observable, of, Subscription, timer } from 'rxjs';
import { catchError, distinctUntilChanged, takeUntil, map, filter, tap, share } from 'rxjs/operators';
import { UohPaySlowConnectionDialogComponent } from '../components/uoh-pay-dialog/uoh-pay-slow-connection-dialog/uoh-pay-slow-connection-dialog.component';
import { UohPayUnreachableDialogComponent } from '../components/uoh-pay-dialog/uoh-pay-unreachable-dialog/uoh-pay-unreachable-dialog.component';
import { UohPayStatus } from '../models/status.model';
import { UohPay } from './uoh-pay.service';

export interface UohPayPing {
  status: UohPayStatus;
  success: boolean;
}

/**
 * Checks the connectivity with the webservice before proceeding with the payment.
 */
@Injectable()
export class UohPayConnectivity implements OnDestroy {
  private readonly TIMEOUT = 10000;
  /**
   * The status of the connection. Undefined if the connection is to be checked/re-checked.
   */
  private ping = new BehaviorSubject<UohPayPing>(undefined);
  private subscription = new Subscription();

  constructor(private dialog: MatDialog, private logger: UohLogger, private pay: UohPay) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Checks the connectivity and raises messages when the connection is slow or when the webservice cannot be reached.
   * This method returns also the status of the payment.
   * @param token The token to perform the check.
   */
  check(token: string): Observable<UohPayPing> {
    this.logger.debug(`[UohPayConnectivity.check] Check connection for token ${token}`);
    const ping$: Observable<UohPayPing> = this.pay.get(token).pipe(
      map((payment) => (!!payment ? { status: payment.status, success: true } : { status: undefined, success: false })),
      catchError((error) => {
        this.logger.error(`[UohPayConnectivity.check] Cannot check connectivity: ${error}`);

        return of({ status: undefined, success: false });
      }),
      share()
    );
    this.subscription.add(
      timer(this.TIMEOUT)
        .pipe(
          tap((_) => this.logger.debug(`[UohPayConnectivity.check] Slow connection alert after ${this.TIMEOUT} ms`)),
          takeUntil(ping$)
        )
        .subscribe((_) =>
          // TODO: Retrieve the direction from language settings.
          this.dialog.open(UohPaySlowConnectionDialogComponent, { direction: 'rtl', disableClose: true })
        )
    );
    this.subscription.add(ping$.subscribe((ping) => this.handleStatus(token, ping)));

    return this.ping.asObservable().pipe(
      filter((ping) => ping !== undefined),
      distinctUntilChanged()
    );
  }

  /**
   * Handles the status of the check. If it fails it shows a message with the option to retry.
   * @param token The token to perform the check.
   * @param ping The result from the check.
   */
  private handleStatus(token: string, ping: UohPayPing): void {
    this.logger.debug(
      `[UohPayConnectivity.handleStatus] For token ${token} success: ${ping.success} status: ${ping.status}`
    );
    this.dialog.closeAll();
    if (!!ping.success) {
      this.ping.next(ping);
    } else {
      // show retry message
      this.subscription.add(
        this.dialog
          // TODO: Retrieve the direction from language settings.
          .open(UohPayUnreachableDialogComponent, { direction: 'rtl', disableClose: true })
          .afterClosed()
          .subscribe((retry) => {
            if (retry) {
              this.check(token);
            } else {
              this.logger.debug(`[UohPayConnectivity.handleStatus] For token ${token} unreachable`);
              this.ping.next(ping);
            }
          })
      );
    }
  }
}
