import { UohPayCurrency } from './currency.model';
import { UohPayCustomer } from './customer.model';
import { UohPayLanguage } from './language.model';
import { UohPayProduct } from './product.model';
import { UohPayTheme } from './theme.model';
import { UohPayType } from './type.model';

/**
 * The parameters to send to a payment terminal.
 */
export interface UohPayParams {
  /**
   * The details of the customer that is buying the product.
   */
  customer: UohPayCustomer;
  /**
   * The product the customer is paying for.
   */
  product: UohPayProduct;
  /**
   * The payment sum.
   */
  sum: number;
  /**
   * The token for the transaction (received from the api).
   */
  token: string;
  /**
   * The payment type: single payment, installments or credit installments.
   * If the type is not single, you should also set the maxInstallments parameter.
   */
  type?: UohPayType;
  /**
   * The maximum number of installments.
   */
  maxInstallments?: number;
  /**
   * The language for the iframe in the payment page.
   */
  language?: UohPayLanguage;
  /**
   * The currency: ILS, USD, EUR...
   */
  currency?: UohPayCurrency;
  /**
   * The theme for the iframe in the payment page.
   */
  theme?: UohPayTheme;
}
