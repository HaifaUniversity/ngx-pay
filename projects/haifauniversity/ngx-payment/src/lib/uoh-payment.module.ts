import { CommonModule } from '@angular/common';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  UohEnvironment,
  UohEnvironmentModule,
  UOH_ENVIRONMENT,
} from '@haifauniversity/ngx-tools';

import {
  UohPaymentConfig,
  UohPaymentOptions,
  UOH_PAYMENT_CONFIG,
  UOH_PAYMENT_OPTIONS,
  UOH_PAYMENT_DEFAULT_OPTIONS,
  getOrigin,
  getEnvironmentURL,
  UohPaymentURL,
} from './models/config.model';
import { UohPaymentService } from './services/uoh-payment.service';
import { UohPaymentPageComponent } from './components/uoh-payment-page/uoh-payment-page.component';
import { UohPaymentDialogComponent } from './components/payment-dialog/uoh-payment-dialog.component';

export function resolvePaymentURL(
  environment: UohEnvironment,
  options: UohPaymentOptions
): string {
  if (!!options && !!options.url) {
    return typeof options.url === 'string'
      ? options.url
      : getEnvironmentURL(environment, options.url);
  }

  return getEnvironmentURL(
    environment,
    UOH_PAYMENT_DEFAULT_OPTIONS.url as UohPaymentURL
  );
}

export function resolvePaymentConfig(
  environment: UohEnvironment,
  options: UohPaymentOptions
): UohPaymentConfig {
  const url = resolvePaymentURL(environment, options);
  const origin = getOrigin(url);
  const local = !!options && !!options.local;

  return {
    interval: UOH_PAYMENT_DEFAULT_OPTIONS.interval,
    maxAttempts: UOH_PAYMENT_DEFAULT_OPTIONS.maxAttempts,
    ...options,
    url,
    origin,
    local,
  };
}

export function resolvePaymentService(
  httpBackend: HttpBackend,
  config: UohPaymentConfig
): UohPaymentService {
  return new UohPaymentService(httpBackend, config);
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    UohEnvironmentModule,
  ],
  declarations: [UohPaymentPageComponent, UohPaymentDialogComponent],
  entryComponents: [UohPaymentDialogComponent],
})
export class UohPaymentModule {
  constructor(@Optional() @SkipSelf() parentModule?: UohPaymentModule) {
    if (!!parentModule) {
      throw new Error(
        'UohPaymentModule is already loaded. Import it in the AppModule only.'
      );
    }
  }

  static forRoot(
    options = UOH_PAYMENT_DEFAULT_OPTIONS
  ): ModuleWithProviders<UohPaymentModule> {
    return {
      ngModule: UohPaymentModule,
      providers: [
        {
          provide: UOH_PAYMENT_OPTIONS,
          useValue: options,
        },
        {
          provide: UOH_PAYMENT_CONFIG,
          useFactory: resolvePaymentConfig,
          deps: [UOH_ENVIRONMENT, UOH_PAYMENT_OPTIONS],
        },
        {
          provide: UohPaymentService,
          useFactory: resolvePaymentService,
          deps: [HttpBackend, UOH_PAYMENT_CONFIG],
        },
      ],
    };
  }
}
