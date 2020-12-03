import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UohLogger } from '@haifauniversity/ngx-tools';
import { BehaviorSubject, Observable, of, Subscription, timer } from 'rxjs';
import { catchError, distinctUntilChanged, takeUntil, map, filter } from 'rxjs/operators';
import { UohPay } from './uoh-pay.service';

@Injectable()
export class UohPayConnectivity implements OnDestroy {
  private success = new BehaviorSubject<boolean>(undefined);
  private subscription = new Subscription();

  constructor(private dialog: MatDialog, private logger: UohLogger, private pay: UohPay) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  check(token: string): Observable<boolean> {
    const ping$ = this.pay.get(token).pipe(
      map((_) => true),
      catchError((_) => of(false))
    );
    this.subscription.add(
      timer(10000)
        .pipe(takeUntil(ping$))
        .subscribe((_) => this.dialog.open(undefined, { disableClose: false }))
    );
    this.subscription.add(ping$.subscribe((status) => this.handleStatus(token, status)));

    return this.success.asObservable().pipe(
      filter((success) => success !== undefined),
      distinctUntilChanged()
    );
  }

  private handleStatus(token: string, success: boolean): void {
    this.dialog.closeAll();
    if (success) {
      this.success.next(true);
    } else {
      // show retry message
      this.subscription.add(
        this.dialog
          .open(undefined, { disableClose: false })
          .afterClosed()
          .subscribe((retry) => {
            if (retry) {
              this.check(token);
            } else {
              this.success.next(false);
            }
          })
      );
    }
  }
}
