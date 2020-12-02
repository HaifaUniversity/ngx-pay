import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpErrorResponse } from '@angular/common/http';
import { Observable, interval, of } from 'rxjs';
import { switchMap, first, tap, catchError } from 'rxjs/operators';
import { UohLogger, UohStore } from '@haifauniversity/ngx-tools';

import { UohPayment, UohPayStatus, UohPayConfig, UOH_PAY_CONFIG } from '../models';

/**
 * Retrieves the payment details from the payment API.
 */
@Injectable()
export class UohPay {
  private store = new UohStore<UohPayment>({ status: UohPayStatus.Pending }, 'uoh-payment');
  private http: HttpClient;
  payment$ = this.store.state$;

  get payment(): UohPayment {
    return this.store.getState();
  }

  constructor(
    private httpBackend: HttpBackend,
    private logger: UohLogger,
    @Inject(UOH_PAY_CONFIG) private config: UohPayConfig
  ) {
    this.http = new HttpClient(httpBackend);
  }

  /**
   * Checks if a message event that comes from the payment service (iframe).
   * @param event The message event.
   */
  isMessageValid(event: MessageEvent): boolean {
    this.logger.debug('[UohPay.isMessageValid] Event origin:', event.origin, 'config.origin:', this.config.origin);

    return event.origin === this.config.origin;
  }

  /**
   * Retrieves the payment status from the message event that comes from the payment service (iframe).
   * For a secure implementation, use only after the isMessageValid method returned true.
   * @param event The message event.
   */
  getStatus(event: MessageEvent): UohPayStatus {
    try {
      if (event.data.toLowerCase() === UohPayStatus.Success.toLowerCase()) {
        this.store.setState({ status: UohPayStatus.Success });

        return UohPayStatus.Success;
      } else if (event.data.toLowerCase() === UohPayStatus.Failure.toLowerCase()) {
        this.store.setState({ status: UohPayStatus.Failure });

        return UohPayStatus.Failure;
      }
    } catch (e) {}

    return UohPayStatus.Pending;
  }

  /**
   * Sets an interval that fires when the payment was received in the server (either success or failure).
   * @param token The payment token.
   */
  onComplete(token: string): Observable<UohPayment> {
    try {
      /**
       * Tries to retrieve the payment details with each interval until the confirmation is no longer pending.
       * The interval is limitted by a maximum number of attemps.
       */
      return interval(this.config.interval).pipe(
        switchMap((attempt) => this.checkAttempt(token, attempt)),
        first((payment) => !!payment && payment.status !== UohPayStatus.Pending)
      );
    } catch (e) {
      const message = this.getErrorMessage(e);

      this.logger.error('[UohPay.onComplete] For token:', token, 'error message:', message);
    }
  }

  /**
   * Retrieves the payment details associated with the token.
   * This method handles HTTP errors internally and logs them.
   * @param token The payment token.
   */
  get(token: string): Observable<UohPayment> {
    try {
      const url = `${this.config.api}/status/${token}`;

      return this.http.get<UohPayment>(url).pipe(
        catchError((error) => {
          const message = this.getErrorMessage(error);
          this.logger.error('[UohPay.get] For token:', token, 'error message:', message);

          return of({ status: UohPayStatus.Pending });
        }),
        tap((payment) => this.store.setState(payment))
      );
    } catch (e) {
      const message = this.getErrorMessage(e);

      this.logger.error('[UohPay.get] For token:', token, 'error message:', message);
    }
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
      this.logger.debug(`[UohPay.checkAttempt] For token:', ${token}, attempt no.: ${attempt}`);
      // Return pending on error so it will retry on the next attempt.
      return this.get(token).pipe(
        tap((payment) =>
          this.logger.debug(
            `[UohPay.checkAttempt] For token: ${token}, attempt no.: ${attempt}, status: ${payment.status}`
          )
        )
      );
    } else {
      throw new Error(
        `[UohPay.checkAttempt] The maximum attempts (${this.config.maxAttempts}) to retrieve the payment for token ${token} was reached`
      );
    }
  }

  /**
   * Returns the error message according to the error type.
   * @param error The error.
   */
  private getErrorMessage(error: HttpErrorResponse | Error): string {
    try {
      if (error instanceof ErrorEvent) {
        // Javascript client-side error during HTTP request.
        return !!error.error ? error.error.message : 'ErrorEvent without message';
      } else if (error instanceof HttpErrorResponse) {
        // Backend error.
        return `HttpErrorResponse with status: ${error.status}, message: ${error.message}, body: ${error.error}`;
      } else {
        // Any error.
        return `Error name: ${error.name}, message: ${error.message}, stack: ${error.stack}`;
      }
    } catch (e) {
      return 'No message';
    }
  }
}
