import { UohPayCurrency } from './currency.model';
import { UohPaymentInstallments } from './installments.model';
import { UohPaymentStatus } from './status.model';
import { UohPayType } from './type.model';

export type UohPaymentCurrency = keyof typeof UohPayCurrency;

export type UohPaymentType = keyof typeof UohPayType;

/**
 * The payment details retrieved from the api.
 * If the payment is pending, only the status will be returned.
 */
export interface UohPayment {
  status: UohPaymentStatus;
  confirmationCode?: string;
  sum?: number;
  currency?: UohPaymentCurrency;
  receivedAt?: string;
  creditResponse?: string;
  type?: UohPaymentType;
  installments?: UohPaymentInstallments;
}
