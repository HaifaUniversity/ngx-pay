import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UohLogger } from '@haifauniversity/ngx-tools';
import { BehaviorSubject, Observable, of, Subscription, timer } from 'rxjs';
import { catchError, distinctUntilChanged, takeUntil, map, filter, tap } from 'rxjs/operators';
import { UohPaySlowConnectionDialogComponent } from '../components/uoh-pay-dialog/uoh-pay-slow-connection-dialog/uoh-pay-slow-connection-dialog.component';
import { UohPayUnreachableDialogComponent } from '../components/uoh-pay-dialog/uoh-pay-unreachable-dialog/uoh-pay-unreachable-dialog.component';
import { UohPay } from './uoh-pay.service';

/**
 * Checks the connectivity with the webservice before proceeding with the payment.
 */
@Injectable()
export class UohPayConnectivity implements OnDestroy {
  private readonly TIMEOUT = 10000;
  private success = new BehaviorSubject<boolean>(undefined);
  private subscription = new Subscription();

  constructor(private dialog: MatDialog, private logger: UohLogger, private pay: UohPay) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Checks the connectivity and raises messages when the connection is slow or when the webservice cannot be reached.
   * @param token The token to perform the check.
   */
  check(token: string): Observable<boolean> {
    this.logger.debug(`[UohPayConnectivity.check] Check connection for token ${token}`);
    const ping$ = this.pay.get(token).pipe(
      map((_) => true),
      catchError((_) => of(false))
    );
    this.subscription.add(
      timer(this.TIMEOUT)
        .pipe(
          tap((_) => this.logger.debug(`[UohPayConnectivity.check] Slow connection alert after ${this.TIMEOUT} ms`)),
          takeUntil(ping$)
        )
        .subscribe((_) => this.dialog.open(UohPaySlowConnectionDialogComponent, { disableClose: false }))
    );
    this.subscription.add(ping$.subscribe((status) => this.handleStatus(token, status)));

    return this.success.asObservable().pipe(
      filter((success) => success !== undefined),
      distinctUntilChanged()
    );
  }

  /**
   * Handles the status of the check. If it fails it shows a message with the option to retry.
   * @param token The token to perform the check.
   * @param success The result from the check.
   */
  private handleStatus(token: string, success: boolean): void {
    this.logger.debug(`[UohPayConnectivity.handleStatus] For token ${token} success: ${success}`);
    this.dialog.closeAll();
    if (success) {
      this.success.next(true);
    } else {
      // show retry message
      this.subscription.add(
        this.dialog
          .open(UohPayUnreachableDialogComponent, { disableClose: false })
          .afterClosed()
          .subscribe((retry) => {
            if (retry) {
              this.check(token);
            } else {
              this.logger.debug(`[UohPayConnectivity.handleStatus] For token ${token} unreachable`);
              this.success.next(false);
            }
          })
      );
    }
  }
}
