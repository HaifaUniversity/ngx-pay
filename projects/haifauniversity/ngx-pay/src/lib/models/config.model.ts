import { InjectionToken } from '@angular/core';

/**
 * The resolved configuration for the payment service.
 */
export interface UohPayConfig {
  api: string;
  origin: string;
  retryScale: number;
  maxAttempts: number;
  url: string;
  placeholder: string;
}

/**
 * The api urls for the payment service in each environment (dev, qa and prod).
 */
export interface UohPayApi {
  development: string;
  qa: string;
  production: string;
}

/**
 * The options to set the payment service.
 */
export interface UohPayOptions {
  /**
   * The url for the payment api (or different urls for each environment: dev, qa and prod).
   */
  api?: UohPayApi | string;
  /**
   * The scale of time (in ms) between retries to check with the api if the payment was received.
   * The delay between retries will be the number of attempt * retryScale.
   */
  retryScale?: number;
  /**
   * The maximum number of attempts to check with the api if the payment was received.
   */
  maxAttempts?: number;
  /**
   * The base url for the payment page (the iframe) - it should contain '{terminal}' as a placeholder for the terminal name.
   */
  url?: string;
}

export const UOH_PAY_CONFIG = new InjectionToken<UohPayConfig>(
  'The resolved configuration for the UOH payment service.'
);
