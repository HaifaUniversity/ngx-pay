import { HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  UohPayConfig,
  UohPayCurrency,
  UohPayLanguage,
  UohPayParams,
  UohPayTheme,
  UohPayType,
  UOH_PAY_CONFIG,
  UOH_PAY_CURRENCY_ID,
  UOH_PAY_DARK_THEME,
  UOH_PAY_DEFAULT_THEME,
  UOH_PAY_TYPE_ID,
} from '../models';

/**
 * Generates the url for the payment page.
 */
@Injectable({ providedIn: 'root' })
export class UohPayUrlBuilder {
  constructor(@Inject(UOH_PAY_CONFIG) private config: UohPayConfig) {}

  /**
   * Builds the url for the payment page.
   * @param terminal The terminal where to execute the payment.
   * @param params The basic parameters to send to the terminal.
   * @param customParams Custom parameters to sent to the terminal.
   */
  build(terminal: string, params: UohPayParams, customParams?: HttpParams): string {
    // Get the base url for the payment page by setting the terminal name in the config url.
    const url = this.config.url.replace(this.config.placeholder, terminal);
    let mappedParams = this.mapParams(params);

    // Merge and override the basic params with the custom ones.
    // If one of the custom params contains the same key as a mapped basic param, the custom one will prevail.
    for (const key of customParams.keys()) {
      const value = customParams.get(key);
      mappedParams = mappedParams.set(key, value);
    }

    return this.endsWithQuestionMark(url) ? `${url}${mappedParams}` : `${url}?${mappedParams}`;
  }

  /**
   * Maps the params for the payment page into a HTTP params object.
   * @param params The params for the payment page.
   */
  private mapParams(params: UohPayParams): HttpParams {
    const currency = this.getCurrency(params.currency);
    const type = this.getType(params.type);
    const theme = params.theme ? params.theme : this.getTheme();

    let result = new HttpParams()
      .set('lang', params.language ? params.language : UohPayLanguage.Hebrew)
      .set('currency', currency.toString())
      .set('pdesc', params.product.description)
      .set('sum', params.sum.toString())
      .set('TranzilaToken', params.token)
      .set('uohToken', params.token)
      .set('contact', `${params.customer.firstName} ${params.customer.lastName}`)
      .set('fname', params.customer.firstName)
      .set('lname', params.customer.lastName)
      .set('myid', params.customer.id)
      .set('studentid', params.customer.id)
      .set('email', params.customer.email)
      .set('DCdisable', params.product.code)
      .set('cred_type', type.toString());

    // Add the maxpay parameter is not a single payment.
    if (!!params.type && params.type !== UohPayType.Single) {
      const maxInstallments = this.getMaxInstallments(params.maxInstallments);
      result = result.set('maxpay', maxInstallments.toString());
    }

    // Finally, add the theme parameters.
    result = result
      .set('trButtonColor', theme.button)
      .set('trBgColor', theme.background)
      .set('trTextColor', theme.text)
      .set('theme', theme.name);

    return result;
  }

  private getCurrency(currency: UohPayCurrency): number {
    return UOH_PAY_CURRENCY_ID[!!currency ? currency : UohPayCurrency.ILS];
  }

  /**
   * Retrieves the payment type. If undefined, returns the single payment type.
   * @param type The payment type.
   */
  private getType(type: UohPayType): number {
    return UOH_PAY_TYPE_ID[!!type ? type : UohPayType.Single];
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
    return this.isDarkTheme() ? UOH_PAY_DARK_THEME : UOH_PAY_DEFAULT_THEME;
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

  /**
   * Returns true if an url ends with a question mark, false otherwise.
   * @param url The url.
   */
  private endsWithQuestionMark(url: string): boolean {
    const lastChar = url.substring(url.length - 1, url.length);

    return lastChar === '?';
  }
}
