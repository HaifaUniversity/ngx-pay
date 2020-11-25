import { CommonModule } from '@angular/common';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UohEnvironmentModule, UOH_ENVIRONMENT } from '@haifauniversity/ngx-tools';

import { UOH_PAY_CONFIG } from './models/config.model';
import { UohPay } from './services/uoh-pay.service';
import { UohPayPageComponent } from './components/uoh-pay-page/uoh-pay-page.component';
import { UohPayDialogComponent } from './components/uoh-pay-dialog/uoh-pay-dialog.component';
import { UOH_PAY_DEFAULT_OPTIONS, UOH_PAY_OPTIONS } from './config/defaults';
import { resolvePaymentConfig, resolvePaymentService } from './config/functions';
import { UohPayFailureComponent } from './components/uoh-pay-failure/uoh-pay-failure.component';

@NgModule({
  imports: [CommonModule, HttpClientModule, MatDialogModule, MatIconModule, UohEnvironmentModule],
  declarations: [UohPayPageComponent, UohPayDialogComponent, UohPayFailureComponent],
  exports: [UohPayPageComponent, UohPayDialogComponent, UohPayFailureComponent],
  entryComponents: [UohPayDialogComponent],
})
export class UohPayModule {
  constructor(@Optional() @SkipSelf() parentModule?: UohPayModule) {
    if (!!parentModule) {
      throw new Error('UohPaymentModule is already loaded. Import it in the AppModule only.');
    }
  }

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
          deps: [HttpBackend, UOH_PAY_CONFIG],
        },
      ],
    };
  }
}
