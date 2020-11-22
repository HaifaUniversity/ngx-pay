import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpParams } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, first, tap } from 'rxjs/operators';
import { UohStore } from '@haifauniversity/ngx-tools';

import {
  UohPayment,
  UohPayStatus,
  UohPayConfig,
  UOH_PAY_CONFIG,
  UohPayCurrency,
  UohPayLanguage,
  UohPayParams,
  UohPayTheme,
} from '../models';
import { UohPayType } from '../models/type.model';

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

  constructor(private httpBackend: HttpBackend, @Inject(UOH_PAY_CONFIG) private config: UohPayConfig) {
    this.http = new HttpClient(httpBackend);
  }

  /**
   * Builds the url for the payment page.
   * @param terminal The terminal where to execute the payment.
   * @param params The basic parameters to send to the terminal.
   * @param customParams Custom parameters to sent to the terminal.
   */
  buildUrl(terminal: string, params: UohPayParams, customParams?: HttpParams): string {
    // Get the base url for the payment page by setting the terminal name in the config url.
    const url = this.config.url.replace(this.config.placeholder, terminal);
    let mappedParams = this.mapParams(params);

    // Merge and override the basic params with the custom ones.
    // If one of the custom params contains the same key as a mapped basic param, the custom one will prevail.
    for (const key of customParams.keys()) {
      const value = customParams.get(key);
      mappedParams = mappedParams.set(key, value);
    }

    return `${url}${mappedParams}`;
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
    /**
     * Tries to retrieve the payment details with each interval until the confirmation is no longer pending.
     * The interval is limitted by a maximum number of attemps.
     */
    return interval(this.config.interval).pipe(
      switchMap((attempt) => this.checkAttempt(token, attempt)),
      first((payment) => !!payment && payment.status !== UohPayStatus.Pending)
    );
  }

  /**
   * Retrieves the payment details associated with the token.
   * @param token The payment token.
   */
  get(token: string): Observable<UohPayment> {
    const url = `${this.config.api}/status/${token}`;

    return this.http.get<UohPayment>(url).pipe(tap((payment) => this.store.setState(payment)));
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
      throw Error(`The maximum attempts (${this.config.maxAttempts}) to retrieve the payment was reached`);
    }
  }

  /**
   * Maps the params for the payment page into a HTTP params object.
   * @param params The params for the payment page.
   */
  private mapParams(params: UohPayParams): HttpParams {
    const type = this.getType(params.type);
    const maxInstallments = this.getMaxInstallments(params.maxInstallments);
    const theme = params.theme ? params.theme : this.getTheme();

    return new HttpParams()
      .set('lang', params.language ? params.language : UohPayLanguage.Hebrew)
      .set('currency', params.currency ? params.currency.toString() : UohPayCurrency.ILS.toString())
      .set('pdesc', params.product.description)
      .set('sum', params.sum.toString())
      .set('TranzilaToken', params.token)
      .set('contact', `${params.customer.firstName} ${params.customer.lastName}`)
      .set('fname', params.customer.firstName)
      .set('lname', params.customer.lastName)
      .set('myid', params.customer.id)
      .set('studentid', params.customer.id)
      .set('email', params.customer.email)
      .set('DCdisable', params.product.code)
      .set('cred_type', type.toString())
      .set('maxpay', maxInstallments.toString())
      .set('u71', '1')
      .set('trButtonColor', theme.button)
      .set('trBgColor', theme.background)
      .set('trTextColor', theme.text);
  }

  /**
   * Retrieves the payment type. If undefined, returns the single payment type.
   * @param type The payment type.
   */
  private getType(type: UohPayType): UohPayType {
    return !!type ? type : UohPayType.Single;
  }

  /**
   * Retrieves the maximum number of installments. If undefined, returns 1.
   * @param maxInstallments The maximum number of installments.
   */
  private getMaxInstallments(maxInstallments: number): number {
    return !!maxInstallments ? maxInstallments : 1;
  }

  /**
   * Retrieves the theme for the payment page.
   */
  private getTheme(): UohPayTheme {
    return this.isDarkTheme()
      ? { button: '0664aa', text: 'ffffff', background: '424242' }
      : { button: '0664aa', text: '333333', background: 'ffffff' };
  }

  /**
   * Checks if the selected theme is the dark-theme.
   */
  private isDarkTheme(): boolean {
    // TODO: Use a uoh theme service to get the theme mode (in future versions).
    try {
      const theme = localStorage.getItem('theme');

      return theme === 'dark-theme';
    } catch (e) {}

    return false;
  }
}
