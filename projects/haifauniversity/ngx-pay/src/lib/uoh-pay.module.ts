import { CommonModule } from '@angular/common';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { UohEnvironmentModule, UohLogger, UOH_ENVIRONMENT, WINDOW } from '@haifauniversity/ngx-tools';

import { UOH_PAY_CONFIG } from './models/config.model';
import { UohPay } from './services/uoh-pay.service';
import { UOH_PAY_DEFAULT_OPTIONS, UOH_PAY_OPTIONS } from './config/defaults';
import { resolvePaymentConfig, resolvePaymentService } from './config/functions';

@NgModule({
  imports: [CommonModule, HttpClientModule, UohEnvironmentModule],
})
export class UohPayModule {
  constructor(@Optional() @SkipSelf() parentModule?: UohPayModule) {
    if (!!parentModule) {
      throw new Error('UohPayModule is already loaded. Import it in the AppModule only.');
    }
  }

  /**
   * Configures a new UohPayModule using the given options.
   * @param options The options for the UohPay service.
   */
  static forRoot(options = UOH_PAY_DEFAULT_OPTIONS): ModuleWithProviders<UohPayModule> {
    return {
      ngModule: UohPayModule,
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
          useFactory: resolvePaymentService,
          deps: [HttpBackend, UohLogger, UOH_PAY_CONFIG],
        },
      ],
    };
  }
}
