/**
 * The codes for the currencies in the 3rd party payment supplier (Tranzila).
 */
export enum UohPayCurrency {
  ILS = 'ILS',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

type UohPayCurrencyId = Record<UohPayCurrency, number>;

export const UOH_PAY_CURRENCY_ID: UohPayCurrencyId = {
  ILS: 1,
  USD: 2,
  EUR: 978,
  GBP: 826,
};
