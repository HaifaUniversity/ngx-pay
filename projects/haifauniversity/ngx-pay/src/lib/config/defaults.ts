import { InjectionToken } from '@angular/core';
import { UohPayOptions, UohPayApi } from '../models/config.model';
import { UohPayContact } from '../models/contact.model';

export const UOH_PAY_DEFAULT_API: UohPayApi = {
  development: 'https://paymentsdev.haifa.ac.il/paymentService/api',
  qa: 'https://paymentsqa.haifa.ac.il/paymentService/api',
  production: 'https://payments.haifa.ac.il/paymentService/api',
};

export const UOH_TERMINAL_PLACEHOLDER = '{terminal}';

export const UOH_PAY_DEFAULT_OPTIONS: UohPayOptions = {
  api: UOH_PAY_DEFAULT_API,
  retryScale: 1000,
  maxAttempts: 10,
  url: `https://direct.tranzila.com/${UOH_TERMINAL_PLACEHOLDER}/iframenew.php`,
  overrideState: false
};

export const UOH_PAY_DEFAULT_CONTACT: UohPayContact = {
  name: 'מרכז שירות ותמיכה',
  email: 'helpdesk@univ.haifa.ac.il',
  website: 'https://stud-hc.haifa.ac.il/he',
};

export const UOH_PAY_OPTIONS = new InjectionToken<UohPayOptions>('User options for the UOH payment service.');
