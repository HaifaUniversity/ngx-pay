import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, interval, of, throwError, timer } from 'rxjs';
import { switchMap, first, tap, catchError, mergeMap, map, retryWhen } from 'rxjs/operators';
import { UohLogger, UohStore } from '@haifauniversity/ngx-tools';

import { UohPayment, UohPayStatus, UohPayConfig, UOH_PAY_CONFIG } from '../models';

/**
 * Retrieves the payment details from the payment API.
 */
@Injectable()
export class UohPay {
  private store = new UohStore<UohPayment>({ status: UohPayStatus.Pending }, 'uoh-payment');
  private http: HttpClient;
  // The following headers prevent browser caching (specially for IE11).
  private readonly HEADERS = new HttpHeaders()
    .set('Cache-Control', 'no-cache')
    .set('Pragma', 'no-cache')
    .set('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
    .set('If-Modified-Since', '0');
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
   * If the interval reached the maximum number of trials it throws an error.
   * @param token The payment token.
   */
  onComplete(token: string): Observable<UohPayment> {
    try {
      /**
       * Tries to retrieve the payment details with each interval until the confirmation is no longer pending.
       * The interval is limitted by a maximum number of attemps.
       */
      return this.get(token).pipe(
        map((payment) => {
          if (payment.status === UohPayStatus.Pending) {
            throw UohPayStatus.Pending;
          }

          return payment;
        }),
        retryWhen((errors) => this.retryStrategy(errors, this.config.interval, this.config.maxAttempts))
      );
    } catch (e) {
      const message = this.getErrorMessage(e);

      throwError(`[UohPay.onComplete] For token: ${token} error message ${message}`);
    }
  }

  /**
   * Retrieves the payment details associated with the token.
   * @param token The payment token.
   */
  get(token: string): Observable<UohPayment> {
    try {
      // TODO: Consider caching the status for the token and return it if success or failure.
      this.store.setState({ status: UohPayStatus.Pending });

      const url = `${this.config.api}/status/${token}`;

      return this.http
        .get<UohPayment>(url, { headers: this.HEADERS })
        .pipe(
          tap((payment) => this.store.setState(payment)),
          catchError((error) => {
            const message = this.getErrorMessage(error);

            return throwError(message);
          })
        );
    } catch (e) {
      const message = this.getErrorMessage(e);

      throwError(`[UohPay.get] For token: ${token} error message: ${message}`);
    }
  }

  /**
   * Resets the stored payment process.
   */
  reset(): void {
    this.store.reset();
  }

  /**
   * Generates a strategy to retry to reach the API.
   * @param errors The errors from the retryWhen pipe.
   * @param delay The number of milliseconds between retries.
   * @param maxAttempts The maximum number of attempts.
   */
  private retryStrategy(errors: Observable<any>, delay: number, maxAttempts: number): Observable<any> {
    return errors.pipe(
      // Merge the errors to assign them a index and count them.
      mergeMap((error, index) => {
        const attempt = index + 1;
        const lapse = delay + attempt;

        this.logger.error(`[UohPay.retryStrategy] Attempt ${attempt}: ${error} retry in ${lapse} ms`);

        // Throw a final error after a number of unsuccessful retries.
        if (attempt > maxAttempts) {
          return throwError(
            `[UohPay.retryStrategy] The maximum number of attempts (${maxAttempts}) was reached: ${error}`
          );
        }

        return timer(lapse);
      })
    );
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
