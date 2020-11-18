import { InjectionToken } from '@angular/core';
import { UohEnvironment } from '@haifauniversity/ngx-tools';
import { URL } from 'url';

export interface UohPaymentConfig {
  url: string;
  origin: string;
  interval: number;
  maxAttempts: number;
  local: boolean;
}

export interface UohPaymentURL {
  development: string;
  qa: string;
  production: string;
}

export interface UohPaymentOptions {
  url?: UohPaymentURL | string;
  interval?: number;
  maxAttempts?: number;
  local?: boolean;
}

export const UOH_PAYMENT_DEFAULT_URL: UohPaymentURL = {
  development: 'https://paymentsdev.haifa.ac.il/paymentService/api',
  qa: 'https://paymentsqa.haifa.ac.il/paymentService/api',
  production: 'https://payments.haifa.ac.il/paymentService/api',
};

export const UOH_PAYMENT_DEFAULT_OPTIONS: UohPaymentOptions = {
  url: UOH_PAYMENT_DEFAULT_URL,
  interval: 500,
  maxAttempts: 30,
};

export const UOH_PAYMENT_CONFIG = new InjectionToken<UohPaymentConfig>(
  'The resolved configuration for the UOH payment service.'
);

export const UOH_PAYMENT_OPTIONS = new InjectionToken<UohPaymentOptions>(
  'User options for the UOH payment service.'
);

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
