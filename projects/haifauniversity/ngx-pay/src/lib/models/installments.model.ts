/**
 * Represents the division of the sum into payments.
 */
export interface UohPaymentInstallments {
  /**
   * The total number of installments selected by the user.
   */
  quantity: number;
  /**
   * The sum for the first installment.
   */
  firstSum: number;
  /**
   * The sum for the installments after the first one.
   */
  sum: number;
}
