import { InjectionToken } from '@angular/core';
import { UohEnvironmentURL } from './environment.model';

export interface UohPaymentConfig {
  url: string;
  origin: string;
  interval: number;
  maxAttempts: number;
  local: boolean;
}

export interface UohPaymentOptions {
  url?: UohEnvironmentURL | string;
  interval?: number;
  maxAttempts?: number;
  local?: boolean;
}

export const UOH_PAYMENT_DEFAULT_URL: UohEnvironmentURL = {
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
