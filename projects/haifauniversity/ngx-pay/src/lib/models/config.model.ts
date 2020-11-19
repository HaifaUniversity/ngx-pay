import { InjectionToken } from '@angular/core';

export interface UohPayConfig {
  url: string;
  origin: string;
  interval: number;
  maxAttempts: number;
  local: boolean;
}

export interface UohPayURL {
  development: string;
  qa: string;
  production: string;
}

export interface UohPayOptions {
  url?: UohPayURL | string;
  interval?: number;
  maxAttempts?: number;
  local?: boolean;
}

export const UOH_PAY_CONFIG = new InjectionToken<UohPayConfig>(
  'The resolved configuration for the UOH payment service.'
);
