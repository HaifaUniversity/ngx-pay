import { InjectionToken } from '@angular/core';

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

export const UOH_PAYMENT_CONFIG = new InjectionToken<UohPaymentConfig>(
  'The resolved configuration for the UOH payment service.'
);
