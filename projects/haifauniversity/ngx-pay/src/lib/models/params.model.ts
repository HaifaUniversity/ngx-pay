/**
 * The customer details.
 */
export interface UohPayCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * The product details.
 */
export interface UohPayProduct {
  description: string;
  code: string;
}

/**
 * The theme to be used in the payment page.
 */
export interface UohPayTheme {
  button: string;
  text: string;
  background: string;
}

export enum UohPayLanguage {
  Hebrew = 'il',
  English = 'us',
  Rusian = 'ru',
  Spanish = 'es',
  German = 'de',
  French = 'fr',
  Japansese = 'jp',
}

export enum UohPayCurrency {
  ILS = 1,
  USD = 2,
  EUR = 978,
  GBP = 826,
}

/**
 * The parameters to send to a payment terminal.
 */
export interface UohPayParams {
  customer: UohPayCustomer;
  product: UohPayProduct;
  sum: number;
  token: string;
  language?: UohPayLanguage;
  currency?: UohPayCurrency;
  theme?: UohPayTheme;
}
