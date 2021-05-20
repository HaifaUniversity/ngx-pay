import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UohLogger } from '@haifauniversity/ngx-tools';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { UohPayPageData } from '../../models/page-data.model';
import { UohPayment } from '../../models/payment.model';
import { UohPayStatus } from '../../models/status.model';
import { HostedFields, TranzilaHostedFields } from '../../models/tranzila-hosted-fields.model';
import { UohPayConnectivity } from '../../services/uoh-pay-connectivity.service';
import { UohPayDeactivate } from '../../services/uoh-pay-deactivate.service';
import { UohPay } from '../../services/uoh-pay.service';
import { UohPayCloseDialogComponent } from '../uoh-pay-dialog/uoh-pay-close-dialog/uoh-pay-close-dialog.component';

/**
 * Displays a terminal payment page in an iframe and handles the payment success or failure.
 */
@Component({
  selector: 'uoh-pay-page',
  templateUrl: './uoh-pay-page.component.html',
  styleUrls: ['./uoh-pay-page.component.css'],
  providers: [UohPayConnectivity],
})
export class UohPayPageComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * True to show a loading message.
   */
  loading$ = new BehaviorSubject<boolean>(false);
  /**
   * The visibility of the payment iframe.
   */
  visibility$ = this.loading$.asObservable().pipe(map((loading) => (loading ? 'hidden' : 'visible')));
  /**
   * The tranzila hosted fields.
   */
  fields: HostedFields;
  /**
   * The pay page configuration details.
   */
  @Input() data: UohPayPageData;
  /**
   * Whether to ask for the ID of the card holder.
   */
  @Input() cardHolderId = false;
  /**
   * Fires true if the payment was successful, false otherwise.
   */
  @Output() paid = new EventEmitter<boolean>();
  /**
   * Fires true if the payment service can be reached, false otherwise.
   */
  @Output() ping = new EventEmitter<boolean>();
  @HostBinding('class') class = 'uoh-pay-page';
  /**
   * True if the user should be asked to confirm the component deactivation.
   */
  private requestConfirmation = true;
  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private logger: UohLogger,
    private pay: UohPay,
    private deactivate: UohPayDeactivate,
    private connectivity: UohPayConnectivity
  ) {}

  ngOnInit(): void {
    // Make sure that the service is available.
    this.subscription.add(this.checkConnectivity().subscribe((paid) => this.paid.emit(paid)));
    // Log the token for the initialized payment.
    this.logger.info('[UohPayPageComponent.ngOnInit] - Payment initialized for token', this.data.token);
    // Check if the component can be deactivated when the guard emits a deactivation request.
    this.subscription.add(
      this.deactivate
        .init()
        .pipe(switchMap((_) => this.canDeactivate()))
        .subscribe((deactivate) => this.deactivate.sendResponse(deactivate))
    );
  }

  ngAfterViewInit(): void {
    this.fields = this.getHostedFields();
  }

  ngOnDestroy(): void {
    this.deactivate.destroy();
    this.subscription.unsubscribe();
  }

  private charge(): void {
    this.loading$.next(true);
    // Wait until the payment service returns a completion status (either success or failure).
    // Then, navigate to the corresponding route.
    this.logger.debug('[UohPayPageComponent.charge] Charging for token:', this.data.token, '.');
    this.subscription.add(
      this.onComplete()
        .pipe(
          tap((_) => (this.requestConfirmation = false)),
          tap((_) => this.loading$.next(false))
        )
        .subscribe((success) => this.paid.emit(success))
    );
  }

  /**
   * This method will be called when the payment iframe posts a message to this component (the parent window).
   * @param event The message event from the iframe.
   */
  @HostListener('window:message', ['$event'])
  handleMessage(event: MessageEvent): void {
    try {
      this.logger.debug('[UohPayPageComponent.handleMessage] Handle message event:', JSON.stringify(event));

      // Check if the message event from the iframe is from a valid origin (the payment service).
      if (this.pay.isMessageValid(event)) {
      }
    } catch (e) {
      const message = !!e && !!e.message ? e.message : 'No message';
      this.logger.error('[UohPayPageComponent.handleMessage] Error:', message);
    }
  }

  /**
   * Returns true if the connectivity with the web service is OK, false otherwise.
   */
  private checkConnectivity(): Observable<boolean> {
    this.loading$.next(true);
    this.logger.debug(`[UohPayPageComponent.checkConnectivity] For token ${this.data.token}`);

    return this.connectivity.check(this.data.token).pipe(
      tap((_) => this.loading$.next(false)),
      // This component can be deactivated if the connectivity check failed.
      tap((ping) => (this.requestConfirmation = ping.success)),
      // Emit the result of the availability check to the parent component.
      tap((ping) => this.ping.emit(ping.success)),
      // If the service is not available behave as in the case that the payment failed.
      // Continue also if the payment status is success or failure.
      filter((ping) => !ping.success || (!!ping.status && ping.status !== UohPayStatus.Pending)),
      // Set as paid if the ping returned success for the payment status.
      map((ping) => ping.success && ping.status === UohPayStatus.Success)
    );
  }

  /**
   * This method will be called before each navigation from this component to verify if it can be deactivated.
   */
  private canDeactivate(): Observable<boolean> {
    // If the status of the payment is still pending ask the user if he/she wants to navigate out.
    if (this.pay.payment.status === UohPayStatus.Pending && this.requestConfirmation) {
      this.logger.debug(
        '[UohPayPageComponent.canDeactivate] Deactivating pending payment with token:',
        this.data.token
      );

      return this.confirm();
    }

    // If the payment was received (succedeed or failed) the user may navigate to another route.
    return of(true);
  }

  /**
   * Displays a confirmation dialog when the user tries to leave this route.
   */
  private confirm(): Observable<boolean> {
    try {
      return (
        this.dialog
          // TODO: Retrieve the direction from the language settings.
          .open(UohPayCloseDialogComponent, { direction: 'rtl', disableClose: true })
          .afterClosed()
          .pipe(
            // Coerce to boolean - convert undefined response to false.
            map((deactivate) => !!deactivate),
            tap((deactivate) => this.logger.debug(`[UohPayPageComponent.confirm] Deactivation: ${deactivate}`)),
            // If the payment was received authorize the deactivation and emit the result using the paid event emitter.
            switchMap((deactivate) => this.checkPayment().pipe(map((_) => deactivate)))
          )
      );
    } catch (e) {
      const message = !!e && !!e.message ? e.message : 'No message';
      this.logger.error('[UohPayPageComponent.confirm] Confirm error:', message);
    }
  }

  /**
   * Checks (once) if the payment was received (either successfull or failed).
   * If so, it emits the result using the paid event emitter.
   */
  private checkPayment(): Observable<UohPayment> {
    this.loading$.next(true);
    this.logger.debug('[UohPayPageComponent.checkPayment] Check payment for token:', this.data.token);

    return this.pay.get(this.data.token).pipe(
      catchError((error) => {
        this.logger.error(`[UohPayPageComponent.checkPayment] Check payment: ${error}`);

        return of({ status: UohPayStatus.Pending });
      }),
      tap((payment) => {
        this.logger.info('[UohPayPageComponent.checkPayment] Check payment:', JSON.stringify(payment));

        if (!!payment && payment.status !== UohPayStatus.Pending) {
          const success = payment.status === UohPayStatus.Success;
          this.paid.emit(success);
        }

        this.loading$.next(false);
      })
    );
  }

  /**
   * Fires when the payment is complete (checking with the stored token).
   * It returns true if the payment is successful, false otherwise.
   */
  private onComplete(): Observable<boolean> {
    return this.pay.onComplete(this.data.token).pipe(
      tap((payment) =>
        this.logger.info('[UohPayPageComponent.onComplete] On complete payment', JSON.stringify(payment))
      ),
      map((payment) => payment.status === UohPayStatus.Success),
      catchError((error) => {
        const message = !!error && !!error.message ? error.message : 'No message';
        this.logger.error('[UohPayPageComponent.onComplete] On complete payment error:', message);

        return of(false);
      })
    );
  }

  /**
   * Generates the tranzila hosted fields.
   * @returns The hosted fields object to interact with tranzila.
   */
  private getHostedFields(): HostedFields {
    const fields = {
      credit_card_number: {
        selector: '#credit_card_num',
        placeholder: 'מספר כרטיס אשראי',
        tabindex: 1,
      },
      cvv: {
        selector: '#cvv',
        placeholder: '3 ספרות בגב הכרטיס',
        tabindex: 4,
      },
      card_holder_id_number: this.cardHolderId
        ? undefined
        : {
            selector: '#card_holder_id_number',
            placeholder: 'מספר ת״ז של בעל הכרטיס',
            tabindex: 2,
          },
      expiry: {
        selector: '#expiry',
        placeholder: 'תוקף',
        version: '2',
        tabindex: 3,
      },
    };
    return new HostedFields({ sandbox: false, styles: {}, fields });
  }
}
