import { HttpBackend } from '@angular/common/http';
import { UohEnvironment } from '@haifauniversity/ngx-tools';
import { UohPayConfig, UohPayOptions, UohPayApi } from '../models/config.model';
import { UohPay } from '../services/uoh-pay.service';
import { UOH_PAY_DEFAULT_OPTIONS, UOH_TERMINAL_PLACEHOLDER } from './defaults';

/**
 * This file contains a set of functions to be used internally (not exposed to the users of this package).
 */

/**
 * Returns the origin from the url, i.e.: 'https://payment.haifa.ac.il' from 'https://payment.haifa.ac.il/paymentService'.
 * @param input The payment url.
 */
export function getOrigin(input: string): string {
  try {
    // Try to convert the string input into an URL and return its origin.
    const url = new URL(input);

    return url.origin;
  } catch (e) {
    // If it fails, fallback to get a slice of the string.
    // Retrieve the position of the first slash that is not followed by another slash.
    const doubleSlash = input.indexOf('//');
    const firstSlash = doubleSlash > -1 ? input.indexOf('/', doubleSlash + 2) : input.indexOf('/');

    return firstSlash > -1 ? input.substring(0, firstSlash) : input;
  }
}

/**
 * Returns the api url that corresponds to the running environment.
 * @param environment The environment the application is running on (dev, qa or prod).
 * @param api The object containing a different api url for each environment.
 */
export function getEnvironmentApi(environment: UohEnvironment, api: UohPayApi): string {
  if (environment === UohEnvironment.Development) {
    return api.development;
  } else if (environment === UohEnvironment.QA) {
    return api.qa;
  } else {
    return api.production;
  }
}

/**
 * Returns the payment api url that corresponds the running environment.
 * @param environment The environment the application is running on.
 * @param options The payment options entered by the user.
 */
export function resolvePaymentApi(environment: UohEnvironment, options: UohPayOptions): string {
  if (!!options && !!options.api) {
    return typeof options.api === 'string' ? options.api : getEnvironmentApi(environment, options.api);
  }

  return getEnvironmentApi(environment, UOH_PAY_DEFAULT_OPTIONS.api as UohPayApi);
}

/**
 * Returns the configuration for the payment service.
 * @param environment The environment the application is running on.
 * @param options The payment options entered by the user.
 */
export function resolvePaymentConfig(environment: UohEnvironment, options: UohPayOptions): UohPayConfig {
  const api = resolvePaymentApi(environment, options);
  const origin = getOrigin(api);
  const local = !!options && !!options.local;

  if (!!options && !!options.url && !options.url.includes(UOH_TERMINAL_PLACEHOLDER)) {
    throw new Error(`The terminal url should include the following pattern ${UOH_TERMINAL_PLACEHOLDER}`);
  }

  return {
    interval: UOH_PAY_DEFAULT_OPTIONS.interval,
    maxAttempts: UOH_PAY_DEFAULT_OPTIONS.maxAttempts,
    url: UOH_PAY_DEFAULT_OPTIONS.url,
    placeholder: UOH_TERMINAL_PLACEHOLDER,
    ...options,
    api,
    origin,
    local,
  };
}

/**
 * A provider factory that returns the PaymentService instance.
 * @param httpBackend The Angular HttpBackend service.
 * @param config The configuration for the payment service.
 */
export function resolvePaymentService(httpBackend: HttpBackend, config: UohPayConfig): UohPay {
  return new UohPay(httpBackend, config);
}
