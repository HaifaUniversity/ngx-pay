import { CommonModule } from '@angular/common';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { UohEnvironmentModule, UohLogger, UOH_ENVIRONMENT } from '@haifauniversity/ngx-tools';

import { UOH_PAY_CONFIG } from './models/config.model';
import { UohPay } from './services/uoh-pay.service';
import { UOH_PAY_DEFAULT_OPTIONS, UOH_PAY_OPTIONS } from './config/defaults';
import { resolveMockService, resolvePaymentConfig } from './config/functions';

/**
 * A mock module for local development.
 */
@NgModule({
  imports: [CommonModule, HttpClientModule, UohEnvironmentModule],
})
export class UohPayMockModule {
  constructor(@Optional() @SkipSelf() parentModule?: UohPayMockModule) {
    if (!!parentModule) {
      throw new Error('UohPayMockModule is already loaded. Import it in the AppModule only.');
    }
  }

  static forRoot(options = UOH_PAY_DEFAULT_OPTIONS): ModuleWithProviders<UohPayMockModule> {
    return {
      ngModule: UohPayMockModule,
      providers: [
        {
          provide: UOH_PAY_OPTIONS,
          useValue: options,
        },
        {
          provide: UOH_PAY_CONFIG,
          useFactory: resolvePaymentConfig,
          deps: [UOH_ENVIRONMENT, UOH_PAY_OPTIONS],
        },
        {
          provide: UohPay,
          useFactory: resolveMockService,
          deps: [HttpBackend, UohLogger, UOH_PAY_CONFIG],
        },
      ],
    };
  }
}
