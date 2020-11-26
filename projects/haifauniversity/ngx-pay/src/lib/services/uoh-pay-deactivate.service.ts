import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * This service handles acts as a proxy between the deactivation guard and the payment page component.
 */
@Injectable({ providedIn: 'root' })
export class UohPayDeactivate {
  private request = new Subject<void>();
  private response = new BehaviorSubject<boolean>(undefined);
  request$ = this.request.asObservable();

  /**
   * This method will be called by the guard, when a request to deactivate the component is emitted.
   * It will fire when the response is set.
   */
  sendRequest(): Observable<boolean> {
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
