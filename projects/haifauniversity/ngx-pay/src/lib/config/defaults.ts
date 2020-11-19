import { InjectionToken } from '@angular/core';
import { UohPayOptions, UohPayURL } from '../models/config.model';

export const UOH_PAYMENT_DEFAULT_URL: UohPayURL = {
  development: 'https://paymentsdev.haifa.ac.il/paymentService/api',
  qa: 'https://paymentsqa.haifa.ac.il/paymentService/api',
  production: 'https://payments.haifa.ac.il/paymentService/api',
};

export const UOH_PAYMENT_DEFAULT_OPTIONS: UohPayOptions = {
  url: UOH_PAYMENT_DEFAULT_URL,
  interval: 500,
  maxAttempts: 30,
};

export const UOH_PAYMENT_OPTIONS = new InjectionToken<UohPayOptions>(
  'User options for the UOH payment service.'
);
