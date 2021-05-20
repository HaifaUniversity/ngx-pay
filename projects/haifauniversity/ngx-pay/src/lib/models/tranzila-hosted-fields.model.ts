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

export interface TranzilaHostedFieldsChargeError {
  error: string;
  messages: Array<{ param: string }>;
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
  private validationErrors: { [key in keyof TranzilaHostedFields]: boolean } = {
    credit_card_number: false,
    cvv: false,
    expiry: false,
    card_holder_id_number: false,
  };
  private handler: TranzilaHostedFieldsHandler;
  charged$ = this._charged.asObservable();
  valid$ = this._valid.asObservable();
  error$ = this._error.asObservable();
  cardType$ = this._cardType.asObservable();

  get charged(): boolean {
    return this._charged.getValue();
  }

  get valid(): boolean {
    return this._valid.getValue();
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
    this.handler.onEvent('blur', this.validityChange);
  }

  hasError(field: keyof TranzilaHostedFields): boolean {
    return this.validationErrors[field];
  }

  charge(config: TranzilaHostedFieldsCharge): void {
    this.handler.charge(config, this.onCharge);
  }

  private validityChange = (result: { field: keyof TranzilaHostedFields }) => {
    let valid = true;

    for (const field in this.config.fields) {
      const fieldValid = result.field === field;
      valid = valid ? valid : false;
      this.validationErrors[field] = !fieldValid;
    }

    this._valid.next(valid);
  };

  private onCardNumberChanged = (result: { cardType: string }) => {
    this._cardType.next(result.cardType);
  };

  private onCharge = (error: TranzilaHostedFieldsChargeError) => {
    let valid = true;
    let paid = true;
    let errorMessage = undefined;

    if (error) {
      if (this.isValidationError(error)) {
        error.messages.forEach((message) => {
          this.validationErrors[message.param] = true;
        });
        valid = false;
      } else {
        errorMessage = error.error_description;
      }
      paid = false;
    }

    this._valid.next(valid);
    this._error.next(errorMessage);
    this._charged.next(paid);
  };

  private isValidationError(error: TranzilaHostedFieldsChargeError): boolean {
    return error.error && error.error === 'invalid_resource' && error.messages.length > 0;
  }
}
