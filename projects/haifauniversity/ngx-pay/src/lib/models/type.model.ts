/**
 * The payment type as represented by the api.
 */
export enum UohPayType {
  /**
   * A single payment.
   */
  Single = 'single',
  /**
   * Installments charged as credit (generally, the number of credit installments is greater than the regular installments).
   */
  Credit = 'credit',
  /**
   * Regular installments (a sum divided into multiple payments).
   */
  Installments = 'installments',
}

type UohPayTypeId = Record<UohPayType, number>;

/**
 * The payment type (or cred_type in Tranzila).
 */
export const UOH_PAY_TYPE_ID: UohPayTypeId = {
  single: 1,
  credit: 6,
  installments: 8,
};

export const UOH_PAY_TYPE_NAME_HE: Record<UohPayType, string> = {
  single: 'תשלום בודד',
  credit: 'תשלומים בקרדיט',
  installments: 'תשלומים',
};
