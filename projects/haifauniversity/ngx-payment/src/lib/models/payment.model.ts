export enum PaymentStatus {
  Pending = 'pending',
  Success = 'success',
  Failure = 'failure',
}

export interface Payment {
  status: PaymentStatus;
  confirmationCode?: string;
  sum?: number;
  receivedAt?: string;
  creditResponse?: string;
}
