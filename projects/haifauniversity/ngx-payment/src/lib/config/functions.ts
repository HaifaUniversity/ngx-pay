import { HttpBackend } from '@angular/common/http';
import { UohEnvironment } from '@haifauniversity/ngx-tools';
import {
  UohPaymentConfig,
  UohPaymentOptions,
  UohPaymentURL,
} from '../models/config.model';
import { UohPaymentService } from '../services/uoh-payment.service';
import { UOH_PAYMENT_DEFAULT_OPTIONS } from './defaults';

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
    const firstSlash =
      doubleSlash > -1
        ? input.indexOf('/', doubleSlash + 2)
        : input.indexOf('/');

    return firstSlash > -1 ? input.substring(0, firstSlash) : input;
  }
}

/**
 * Returns the url that corresponds to the running environment.
 * @param environment The environment the application is running on (dev, qa or prod).
 * @param url The object containing a different url for each environment.
 */
export function getEnvironmentURL(
  environment: UohEnvironment,
  url: UohPaymentURL
): string {
  if (environment === UohEnvironment.Development) {
    return url.development;
  } else if (environment === UohEnvironment.QA) {
    return url.qa;
  } else {
    return url.production;
  }
}

/**
 * Returns the payment URL that corresponds the running environment.
 * @param environment The environment the application is running on.
 * @param options The payment options entered by the user.
 */
export function resolvePaymentURL(
  environment: UohEnvironment,
  options: UohPaymentOptions
): string {
  if (!!options && !!options.url) {
    return typeof options.url === 'string'
      ? options.url
      : getEnvironmentURL(environment, options.url);
  }

  return getEnvironmentURL(
    environment,
    UOH_PAYMENT_DEFAULT_OPTIONS.url as UohPaymentURL
  );
}

/**
 * Returns the configuration for the payment service.
 * @param environment The environment the application is running on.
 * @param options The payment options entered by the user.
 */
export function resolvePaymentConfig(
  environment: UohEnvironment,
  options: UohPaymentOptions
): UohPaymentConfig {
  const url = resolvePaymentURL(environment, options);
  const origin = getOrigin(url);
  const local = !!options && !!options.local;

  return {
    interval: UOH_PAYMENT_DEFAULT_OPTIONS.interval,
    maxAttempts: UOH_PAYMENT_DEFAULT_OPTIONS.maxAttempts,
    ...options,
    url,
    origin,
    local,
  };
}

/**
 * A provider factory that returns the PaymentService instance.
 * @param httpBackend The Angular HttpBackend service.
 * @param config The configuration for the payment service.
 */
export function resolvePaymentService(
  httpBackend: HttpBackend,
  config: UohPaymentConfig
): UohPaymentService {
  return new UohPaymentService(httpBackend, config);
}
