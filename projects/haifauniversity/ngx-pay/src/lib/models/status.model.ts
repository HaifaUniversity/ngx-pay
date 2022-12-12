/**
 * The status for the payment retrieved from the api.
 */
export enum UohPayStatus {
  Pending = 'pending',
  Success = 'success',
  Failure = 'failure',
}
export const errorCods: Array<code> = [
  { "key": '001', "value": 'כרטיס חסום. אין אישור לביצוע העסקה על ידי חברת האשראי. ניתן להתקשר לחברת האשראי או לנסות לחייב כרטיס אחר.' },
  { "key": '002', "value": 'כרטיס גנוב. אין אישור לביצוע העסקה על ידי חברת האשראי. ניתן להתקשר לחברת האשראי או לנסות לחייב כרטיס אחר.' },
  { "key": '003', "value": 'סירוב. אין אישור לביצוע העסקה על ידי חברת האשראי. ניתן להתקשר לחברת האשראי או לנסות לחייב כרטיס אחר.' },
  { "key": '004', "value": 'סירוב. אין אישור לביצוע העסקה על ידי חברת האשראי. ניתן להתקשר לחברת האשראי או לנסות לחייב כרטיס אחר.' },
  { "key": '005', "value": 'כרטיס מזויף. אין אישור לביצוע העסקה על ידי חברת האשראי. ניתן להתקשר לחברת האשראי או לנסות לחייב כרטיס אחר.' },
  { "key": '006', "value": 'שגיאה במספר ה-CVV (הספרות בגב הכרטיס). יש לוודא שהספרות הוזנו בצורה מדויקת.' },
  { "key": '015', "value": 'כרטיס האשראי שהוזן פג תוקף. יש לנסות לחייב כרטיס אשראי אחר.' },
  { "key": '016', "value": 'דחייה - אין הרשאה לסוג מטבע.' },
  { "key": '017', "value": 'דחייה - אין הרשאה לסוג אשראי בעסקה.' }]
  export const errorCodsENG: Array<code> = [
    { "key": '001', "value": '.Transaction not permitted. This card reported as blocked' },
    { "key": '002', "value": 'Transaction not permitted. This card reported as lost or stolen.' },
    { "key": '003', "value": 'Transaction not permitted. Please try a different card or contact your card issuer.' },
    { "key": '004', "value": 'Transaction not permitted. Please try a different card or contact your card issuer.' },
    { "key": '005', "value": 'Transaction not permitted. Fear of fraud' },
    { "key": '006', "value": 'You have incorrectly entered your CVV code.' },
    { "key": '015', "value": 'Transaction not permitted. Expired card.' },
    { "key": '016', "value": 'Transaction not permitted. Currency not allowed.' },
    { "key": '017', "value": 'Transaction not permitted. Issuer not allowed.' }]
export class code {
  key: string;
  value: string;
}