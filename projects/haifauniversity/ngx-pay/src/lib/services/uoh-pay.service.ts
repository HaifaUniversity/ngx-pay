import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { tap, catchError, mergeMap, map, retryWhen } from 'rxjs/operators';
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
  getMessageStatus(event: MessageEvent): UohPayStatus {
    try {
      if (event.data.toLowerCase() === UohPayStatus.Success.toLowerCase()) {
        return UohPayStatus.Success;
      } else if (event.data.toLowerCase() === UohPayStatus.Failure.toLowerCase()) {
        return UohPayStatus.Failure;
      }
    } catch (e) {}

    return UohPayStatus.Pending;
  }

  /**
   * Retrieves the payment details associated with the token when the payment is complete (either success or failure).
   * It retries in case of errors or a pending payment until the maximum number of trials (see UohPayOptions) is reached.
   * @param token The payment token.
   */
  onComplete(token: string): Observable<UohPayment> {
    try {
      // Tries to retrieve the payment details until it is no longer pending.
      return this.get(token).pipe(
        map((payment) => {
          if (payment.status === UohPayStatus.Pending) {
            throw UohPayStatus.Pending;
          }

          return payment;
        }),
        retryWhen((errors) => this.retryStrategy(errors, this.config.retryScale, this.config.maxAttempts))
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
   * @param scale The scale of time (in ms) to calculate the delay (scale * number of attempt) between retries.
   * @param maxAttempts The maximum number of attempts.
   */
  private retryStrategy(errors: Observable<any>, scale: number, maxAttempts: number): Observable<any> {
    return errors.pipe(
      // Merge the errors to assign them a index and count them.
      mergeMap((error, index) => {
        const attempt = index + 1;
        const delay = scale + attempt;

        this.logger.error(`[UohPay.retryStrategy] Attempt ${attempt}: ${error} retry in ${delay} ms`);

        // Throw a final error after a number of unsuccessful retries.
        if (attempt > maxAttempts) {
          return throwError(
            `[UohPay.retryStrategy] The maximum number of attempts (${maxAttempts}) was reached: ${error}`
          );
        }

        return timer(delay);
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
