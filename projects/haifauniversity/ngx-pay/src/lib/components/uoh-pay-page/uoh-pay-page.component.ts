import { Component, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UohLogger, UohLogLevel } from '@haifauniversity/ngx-tools';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { UohPayment } from '../../models/payment.model';
import { UohPayStatus } from '../../models/status.model';
import { UohPayDeactivate } from '../../services/uoh-pay-deactivate.service';
import { UohPay } from '../../services/uoh-pay.service';
import { UohPayDialogComponent } from '../uoh-pay-dialog/uoh-pay-dialog.component';

/**
 * Displays a terminal payment page in an iframe and handles the payment success or failure.
 */
@Component({
  selector: 'uoh-pay-page',
  templateUrl: './uoh-pay-page.component.html',
  styleUrls: ['./uoh-pay-page.component.css'],
})
export class UohPayPageComponent implements OnInit, OnDestroy {
  /**
   * The sanitized url for the terminal page.
   */
  sanitizedUrl: SafeResourceUrl;
  /**
   * The width for the iframe.
   */
  @Input() width = '100%';
  /**
   * The height for the iframe.
   */
  @Input() height = '480';
  /**
   * The border for the iframe.
   */
  @Input() border = 0;
  /**
   * The token for the payment attempt.
   */
  @Input() token: string;
  /**
   * The url for the terminal to execute the payment.
   */
  @Input() set url(url: string) {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  /**
   * Fires true if the payment was successful, false otherwise.
   */
  @Output() paid = new EventEmitter<boolean>();
  @HostBinding('class') class = 'uoh-pay-page';
  private subscription = new Subscription();

  constructor(
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private logger: UohLogger,
    private pay: UohPay,
    private deactivate: UohPayDeactivate
  ) {}

  ngOnInit(): void {
    // Log the sanitized url for the terminal page.
    const url = this.sanitizedUrl ? this.sanitizedUrl.toString() : undefined;
    this.logger.info('Payment initialized for url', url, 'for token', this.token);
    // Check if the component can be deactivated when the guard emits a deactivation request.
    this.subscription.add(
      this.deactivate.request$
        .pipe(switchMap((_) => this.canDeactivate()))
        .subscribe((deactivate) => this.deactivate.sendResponse(deactivate))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * This method will be called before the user closes, reloads or navigates away from this application.
   * @param event The before unload event.
   */
  @HostListener('window:beforeunload', ['$event'])
  shouldExit(event: BeforeUnloadEvent): boolean {
    this.logger.log(UohLogLevel.DEBUG, false, 'Window before unload event occurred. Payment token:', this.token);

    // Ask the user if he/she really wants to unload this application.
    event.preventDefault();
    event.returnValue = 'התשלום טרם הסתיים?';

    return false;
  }

  /**
   * This method will be called when the payment iframe posts a message to this component (the parent window).
   * @param event The message event from the iframe.
   */
  @HostListener('window:message', ['$event'])
  handleMessage(event: MessageEvent): void {
    this.logger.debug('Handle message event:', JSON.stringify(event));

    // Check if the message event from the iframe is from a valid origin (the payment service).
    if (this.pay.isMessageValid(event)) {
      // If the message returns the status of failure navigate to the corresponding route.
      if (this.pay.getStatus(event) === UohPayStatus.Failure) {
        this.paid.emit(false);
      } else {
        // Else, wait until the payment service returns a completion status (either success or failure).
        // Then, navigate to the corresponding route.
        this.subscription.add(
          this.pay
            .onComplete(this.token)
            .pipe(
              tap((payment) => this.logger.info('On complete payment', JSON.stringify(payment))),
              map((payment) => payment.status === UohPayStatus.Success),
              catchError((error) => {
                this.logger.error('On complete payment error:', JSON.stringify(error));

                return of(false);
              })
            )
            .subscribe((success) => this.paid.emit(success))
        );
      }
    }
  }

  /**
   * This method will be called before each navigation from this component to verify if it can be deactivated.
   */
  private canDeactivate(): Observable<boolean> {
    // If the status of the payment is still pending ask the user if he/she wants to navigate out.
    if (this.pay.payment.status === UohPayStatus.Pending) {
      this.logger.debug('Deactivating pending payment with token:', this.token);
      return this.confirm();
    }

    // If the payment was received (succedeed or failed) the user may navigate to another route.
    return of(true);
  }

  /**
   * Displays a confirmation dialog when the user tries to leave this route.
   */
  private confirm(): Observable<boolean> {
    return (
      this.dialog
        // TODO: Retrieve the direction from the language settings.
        .open(UohPayDialogComponent, { direction: 'rtl' })
        .afterClosed()
        .pipe(
          // Coerce to boolean - convert undefined response to false.
          map((deactivate) => !!deactivate),
          tap((deactivate) => this.logger.debug(`Deactivation: ${deactivate}`)),
          // If the payment was received autorize the deactivation and emit the result using the paid event emitter.
          switchMap((deactivate) => this.checkPayment().pipe(map((_) => deactivate)))
        )
    );
  }

  /**
   * Checks (once) if the payment was received (either successfull or failed).
   * If so, it emits the result using the paid event emitter.
   */
  private checkPayment(): Observable<UohPayment> {
    this.logger.debug('Check payment for token:', this.token);

    return this.pay.get(this.token).pipe(
      catchError((error) => {
        this.logger.error('Check payment error:', JSON.stringify(error));

        return of({ status: UohPayStatus.Pending });
      }),
      tap((payment) => {
        this.logger.info('Check payment:', JSON.stringify(payment));
        if (!!payment && payment.status !== UohPayStatus.Pending) {
          const success = payment.status === UohPayStatus.Success;
          this.paid.emit(success);
        }
      })
    );
  }
}
