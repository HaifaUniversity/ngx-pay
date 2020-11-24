import { UohPayCurrency } from './currency.model';

/**
 * The product details.
 */
export interface UohPayProduct {
  description: string;
  code: string;
  price?: number;
  commission?: number;
  currency?: UohPayCurrency;
}
