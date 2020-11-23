import { UohPayCurrency } from './currency.model';
import { UohPayInstallments } from './installments.model';
import { UohPayStatus } from './status.model';
import { UohPayType } from './type.model';

/**
 * The payment details retrieved from the api.
 * If the payment is pending, only the status will be returned.
 */
export interface UohPayment {
  status: UohPayStatus;
  confirmationCode?: string;
  sum?: number;
  currency?: UohPayCurrency;
  receivedAt?: string;
  creditResponse?: string;
  type?: UohPayType;
  installments?: UohPayInstallments;
}
