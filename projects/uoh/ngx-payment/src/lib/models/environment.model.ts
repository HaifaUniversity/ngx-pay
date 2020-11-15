import { DOCUMENT } from '@angular/common';
import { FactoryProvider, InjectionToken } from '@angular/core';

export enum UohEnvironment {
  Development = 'dev',
  QA = 'qa',
  Production = '',
}

export interface UohEnvironmentURL {
  development: string;
  qa: string;
  production: string;
}

export function getEnvironment(document: Document): UohEnvironment {
  if (document.location.hostname.includes(UohEnvironment.Development)) {
    return UohEnvironment.Development;
  } else if (document.location.hostname.includes(UohEnvironment.QA)) {
    return UohEnvironment.QA;
  } else {
    return UohEnvironment.Production;
  }
}

export function getEnvironmentURL(
  environment: UohEnvironment,
  url: UohEnvironmentURL
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
 * Returns the origin from the url, i.e.: 'https://payment.haifa.ac.il' from 'https://payment.haifa.ac.il/paymentService'.
 * @param url The payment url.
 */
export function getOrigin(url: string): string {
  // Retrieve the position of the first slash that is not followed by another slash.
  const doubleSlash = url.indexOf('//');
  const firstSlash =
    doubleSlash > -1 ? url.indexOf('/', doubleSlash + 2) : url.indexOf('/');

  return firstSlash > -1 ? url.substring(0, firstSlash) : url;
}

export const UOH_ENVIRONMENT = new InjectionToken<UohEnvironment>(
  'The environment this app is running on.'
);

export const UOH_ENVIRONMENT_FACTORY: FactoryProvider = {
  provide: UOH_ENVIRONMENT,
  useFactory: getEnvironment,
  deps: [DOCUMENT],
};
