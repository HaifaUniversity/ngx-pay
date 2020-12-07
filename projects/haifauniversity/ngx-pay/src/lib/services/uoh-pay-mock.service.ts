import { Injectable } from '@angular/core';
import { HttpBackend } from '@angular/common/http';
import { UohLogger } from '@haifauniversity/ngx-tools';
import { UohPayConfig, UohPayStatus } from '../models';
import { UohPay } from './uoh-pay.service';

/**
 * Adds and overrides UohPay methods to assure functionality on local development.
 */
@Injectable()
export class UohPayMock extends UohPay {
  private readonly ORIGIN = 'http://localhost:4200';

  constructor(httpBackend: HttpBackend, logger: UohLogger, config: UohPayConfig) {
    super(httpBackend, logger, config);
  }

  /**
   * Mocks the postMessage mechanism by sending a message to this window.
   */
  mock(): void {
    const message = UohPayStatus.Pending;
    window.postMessage(message, this.ORIGIN);
  }

  /**
   * Mocks the validation of the postMessage event.
   * @param event The message event.
   */
  isMessageValid(event: MessageEvent): boolean {
    return true;
  }
}
