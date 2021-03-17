import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * This service handles acts as a proxy between the deactivation guard and the payment page component.
 */
@Injectable({ providedIn: 'root' })
export class UohPayDeactivate {
  /**
   * Represents a deactivation request sent by the guard.
   */
  private request = new Subject<void>();
  /**
   * Represents a deactivation response sent by the uoh-pay-page component.
   */
  private response = new BehaviorSubject<boolean>(undefined);
  /**
   * Whether this service should be active. That is, should check the deactivation.
   * This property should be false if the uoh-pay-page is not present on screen.
   */
  private active = false;

  /**
   * Initializes this service - check if the uoh-pay-page can be deactivated.
   */
  init(): Observable<void> {
    this.active = true;

    return this.request.asObservable();
  }

  /**
   * Destroys this service - the uoh-pay-page is no longer present on screen.
   */
  destroy(): void {
    this.active = false;
  }

  /**
   * This method will be called by the guard, when a request to deactivate the component is emitted.
   * It will fire when the response is set.
   */
  sendRequest(): Observable<boolean> {
    // Continue only if this service is active.
    if (!this.active) {
      return of(true);
    }

    // Reset the response. Thus, the guard will wait for a new one.
    this.response.next(undefined);
    this.request.next();

    return this.response.asObservable().pipe(filter((deactivate) => deactivate !== undefined && deactivate !== null));
  }

  /**
   * This method will be called by the component, when it decides whether it can be deactivated or not.
   * @param deactivate True if the guard can deactivate the component, false otherwise.
   */
  sendResponse(deactivate: boolean): void {
    this.response.next(deactivate);
  }
}
