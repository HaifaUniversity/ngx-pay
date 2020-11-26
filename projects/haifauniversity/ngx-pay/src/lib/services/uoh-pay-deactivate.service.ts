import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * This service handles acts as a proxy between the deactivation guard and the payment page component.
 */
@Injectable({ providedIn: 'root' })
export class UohPayDeactivate {
  private request = new Subject<void>();
  private response = new Subject<boolean>();
  request$ = this.request.asObservable();
  response$ = this.response
    .asObservable()
    .pipe(filter((deactivate) => deactivate !== undefined && deactivate !== null));

  /**
   * This method will be called by the guard, when a request to deactivate the component is emitted.
   */
  onRequest(): void {
    this.request.next();
  }

  /**
   * This method will be called by the component, when it decides whether it can be deactivated or not.
   * @param deactivate True if the guard can deactivate the component, false otherwise.
   */
  onResponse(deactivate: boolean): void {
    this.response.next(deactivate);
  }
}
