import { UohPayStatus } from './status.model';

/**
 * The payment details retrieved from the api.
 * If the payment is pending, only the status will be returned.
 */
export interface UohPayment {
  status: UohPayStatus;
  confirmationCode?: string;
  sum?: number;
  receivedAt?: string;
  creditResponse?: string;
}
