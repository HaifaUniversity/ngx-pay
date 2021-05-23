import { BehaviorSubject } from 'rxjs';
import { UohPayCurrency } from './currency.model';
import { UohPayLanguage } from './language.model';

export interface TranzilaHostedField {
  selector: string;
  placeholder: string;
  tabindex: number;
  version?: string;
}

export interface TranzilaHostedFields {
  credit_card_number: TranzilaHostedField;
  cvv: TranzilaHostedField;
  expiry: TranzilaHostedField;
  card_holder_id_number?: TranzilaHostedField;
}

export interface TranzilaHostedFieldsConfig {
  sandbox: boolean;
  styles: any;
  fields: TranzilaHostedFields;
}

export enum TranzilaHostedFieldsMode {
  Debit = 'A',
  Capture = 'V',
  Validate = 'N',
}

export enum TranzilaHostedFieldsPlan {
  Single = '1',
  Credit = '6',
  Installments = '8',
}

export interface TranzilaHostedFieldsCharge {
  terminal_name: string;
  amount: string;
  uohToken: string;
  TranzilaToken: string;
  DCdisable: string;
  pdesc: string;
  contact: string;
  fname: string;
  lname: string;
  myid: string;
  studentid: string;
  email: string;
  first_installment_amount?: string;
  other_installments_amount?: string;
  total_installments_number?: string;
  card_holder_id_number?: string;
  currency_code?: UohPayCurrency;
  payment_plan?: TranzilaHostedFieldsPlan;
  tran_mode?: TranzilaHostedFieldsMode;
  tokenize?: boolean;
  expiry_month?: string;
  expiry_year?: string;
  response_language?: UohPayLanguage;
}

export interface TranzilaHostedFieldsChargeFieldError {
  code: string;
  param: string;
  message: string;
}

export interface TranzilaHostedFieldsChargeError {
  error: string;
  messages: Array<TranzilaHostedFieldsChargeFieldError>;
  error_description: string;
}

export interface TranzilaHostedFieldsHandler {
  onEvent(name: string, callback: (event: any) => void): void;
  charge(config: TranzilaHostedFieldsCharge, callback: (error: TranzilaHostedFieldsChargeError) => void): void;
}

export interface TranzilaHostedFieldsBuilder {
  create(config: TranzilaHostedFieldsConfig): TranzilaHostedFieldsHandler;
}

declare const TzlaHostedFields: TranzilaHostedFieldsBuilder;

/**
 * Wrapper class for the tranzila hosted fields.
 */
export class HostedFields {
  private _charged = new BehaviorSubject<boolean>(undefined);
  private _valid = new BehaviorSubject<boolean>(false);
  private _error = new BehaviorSubject<string>(undefined);
  private _cardType = new BehaviorSubject<string>(undefined);
  private _charging = new BehaviorSubject<boolean>(undefined);
  private validationErrors: { [key in keyof TranzilaHostedFields]: TranzilaHostedFieldsChargeFieldError | null } = {
    credit_card_number: null,
    cvv: null,
    expiry: null,
    card_holder_id_number: null,
  };
  private handler: TranzilaHostedFieldsHandler;
  charged$ = this._charged.asObservable();
  valid$ = this._valid.asObservable();
  error$ = this._error.asObservable();
  cardType$ = this._cardType.asObservable();
  charging$ = this._charging.asObservable();

  get charged(): boolean {
    return this._charged.getValue();
  }

  get valid(): boolean {
    for (const field in this.validationErrors) {
      if (!!this.validationErrors[field]) {
        return false;
      }
    }

    return true;
  }

  get error(): string {
    return this._error.getValue();
  }

  get cardType(): string {
    return this._cardType.getValue();
  }

  constructor(public config: TranzilaHostedFieldsConfig) {}

  init(): void {
    this.handler = TzlaHostedFields.create(this.config);
    this.handler.onEvent('cardTypeChange', this.onCardNumberChanged);
    this.handler.onEvent('blur', this.onTouched);
  }

  hasError(field: keyof TranzilaHostedFields): boolean {
    return !!this.validationErrors[field];
  }

  getError(field: keyof TranzilaHostedFields): string {
    return this.hasError(field) ? this.validationErrors[field].message : '';
  }

  charge(config: TranzilaHostedFieldsCharge): void {
    this._charging.next(true);
    this.handler.charge(config, this.onCharge);
  }

  private onTouched = (result: { field: keyof TranzilaHostedFields }) => {
    this.validationErrors[result.field] = null;
    this._valid.next(this.valid);
    if (!!this.error) {
      this._error.next('');
    }
  };

  private onCardNumberChanged = (result: { cardType: string }) => {
    this._cardType.next(result.cardType);
  };

  private onCharge = (error: TranzilaHostedFieldsChargeError) => {
    let paid = true;
    let errorMessage = undefined;

    if (error) {
      if (this.isValidationError(error)) {
        error.messages.forEach((message) => {
          this.validationErrors[message.param] = message;
        });
      } else {
        errorMessage = error.error_description;
      }
      paid = false;
    }

    this._valid.next(this.valid && !errorMessage);
    this._error.next(errorMessage);
    this._charged.next(paid);
    this._charging.next(false);
  };

  private isValidationError(error: TranzilaHostedFieldsChargeError): boolean {
    return error.error && error.error === 'invalid_resource' && error.messages.length > 0;
  }
}
