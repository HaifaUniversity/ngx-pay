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
  UohEnvironmentModule,
  UOH_ENVIRONMENT,
} from '@haifauniversity/ngx-tools';

import { UOH_PAYMENT_CONFIG } from './models/config.model';
import { UohPaymentService } from './services/uoh-payment.service';
import { UohPaymentPageComponent } from './components/uoh-payment-page/uoh-payment-page.component';
import { UohPaymentDialogComponent } from './components/payment-dialog/uoh-payment-dialog.component';
import {
  UOH_PAYMENT_DEFAULT_OPTIONS,
  UOH_PAYMENT_OPTIONS,
} from './config/defaults';
import {
  resolvePaymentConfig,
  resolvePaymentService,
} from './config/functions';

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
