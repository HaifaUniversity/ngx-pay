export enum UohPaymentStatus {
  Pending = 'pending',
  Success = 'success',
  Failure = 'failure',
}

export interface UohPayment {
  status: UohPaymentStatus;
  confirmationCode?: string;
  sum?: number;
  receivedAt?: string;
  creditResponse?: string;
}
