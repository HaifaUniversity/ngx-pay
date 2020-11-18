import { InjectionToken } from '@angular/core';
import { UohPaymentOptions, UohPaymentURL } from '../models/config.model';

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

export const UOH_PAYMENT_OPTIONS = new InjectionToken<UohPaymentOptions>(
  'User options for the UOH payment service.'
);
