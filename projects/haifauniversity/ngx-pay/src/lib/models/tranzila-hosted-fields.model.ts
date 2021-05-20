import { UohPayCurrency } from './currency.model';

export interface TranzilaHostedField {
  selector: string;
  placeholder: string;
  tabindex: number;
  version?: string;
}

export interface TranzilaHostedFieldsConfig {
  sandbox: boolean;
  styles: any;
  fields: {
    credit_card_number: TranzilaHostedField;
    cvv: TranzilaHostedField;
    expiry: TranzilaHostedField;
    card_holder_id_number?: TranzilaHostedField;
  };
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
  response_language?: 'english' | 'hebrew';
}

export interface TranzilaHostedFields {
  onEvent(event: string, callback: (result: any) => void): void;
  charge(config: TranzilaHostedFieldsCharge, callback: (result: any) => void): void;
}

export interface TranzilaHostedFieldsBuilder {
  create(config: TranzilaHostedFieldsConfig): TranzilaHostedFields;
}
