/**
 * The payment type (or cred_type in Tranzila).
 */
export enum UohPayType {
  /**
   * A single payment.
   */
  SINGLE = 1,
  /**
   * Installments charged as credit (generally, the number of credit installments is greater than the regular installments).
   */
  CREDIT = 6,
  /**
   * Regular installments (a sum divided into multiple payments).
   */
  INSTALLMENTS = 8,
}
