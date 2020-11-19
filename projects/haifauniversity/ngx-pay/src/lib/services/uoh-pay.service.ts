import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, first, tap } from 'rxjs/operators';
import { UohStore } from '@haifauniversity/ngx-tools';

import { UohPayment, UohPaymentStatus } from '../models/payment.model';
import { UohPayConfig, UOH_PAY_CONFIG } from '../models/config.model';

/**
 * Retrieves the payment details from the payment API.
 */
@Injectable()
export class UohPay {
  private store = new UohStore<UohPayment>(
    { status: UohPaymentStatus.Pending },
    'uoh-payment'
  );
  private http: HttpClient;
  payment$ = this.store.state$;

  get payment(): UohPayment {
    return this.store.getState();
  }

  constructor(
    private httpBackend: HttpBackend,
    @Inject(UOH_PAY_CONFIG) private config: UohPayConfig
  ) {
    this.http = new HttpClient(httpBackend);
  }

  /**
   * Checks if a message event that comes from the payment service (iframe).
   * @param event The message event.
   */
  isMessageValid(event: MessageEvent): boolean {
    return event.origin === this.config.origin;
  }

  /**
   * Retrieves the payment status from the message event that comes from the payment service (iframe).
   * For a secure implementation, use only after the isMessageValid method returned true.
   * @param event The message event.
   */
  getStatus(event: MessageEvent): UohPaymentStatus {
    try {
      if (event.data.toLowerCase() === UohPaymentStatus.Success.toLowerCase()) {
        this.store.setState({ status: UohPaymentStatus.Success });

        return UohPaymentStatus.Success;
      } else if (
        event.data.toLowerCase() === UohPaymentStatus.Failure.toLowerCase()
      ) {
        this.store.setState({ status: UohPaymentStatus.Failure });

        return UohPaymentStatus.Failure;
      }
    } catch (e) {}

    return UohPaymentStatus.Pending;
  }

  /**
   * Sets an interval that fires when the payment was received in the server (either success or failure).
   * @param token The payment token.
   */
  onComplete(token: string): Observable<UohPayment> {
    /**
     * Tries to retrieve the payment details with each interval until the confirmation is no longer pending.
     * The interval is limitted by a maximum number of attemps.
     */
    return interval(this.config.interval).pipe(
      switchMap((attempt) => this.checkAttempt(token, attempt)),
      first(
        (payment) => !!payment && payment.status !== UohPaymentStatus.Pending
      )
    );
  }

  /**
   * Retrieves the payment details associated with the token.
   * @param token The payment token.
   */
  get(token: string): Observable<UohPayment> {
    const url = `${this.config.url}/status/${token}`;

    return this.http
      .get<UohPayment>(url)
      .pipe(tap((payment) => this.store.setState(payment)));
  }

  /**
   * Resets the stored payment process.
   */
  reset(): void {
    this.store.reset();
  }

  /**
   * Tries to check if the payment was received, but if the maximum number of attempts was reached it throws an error.
   * @param token The payment token.
   * @param attempt The attempt number.
   */
  private checkAttempt(token: string, attempt: number): Observable<UohPayment> {
    if (attempt < this.config.maxAttempts) {
      return this.get(token);
    } else {
      throw Error(
        `The maximum attempts (${this.config.maxAttempts}) to retrieve the payment was reached`
      );
    }
  }
}
