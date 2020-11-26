import { Injectable } from '@angular/core';
import { CanDeactivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UohPayDeactivate } from '../services/uoh-pay-deactivate.service';

/**
 * Transfers the authority to deactivate the T component to the UohPayPageComponent.
 */
@Injectable({
  providedIn: 'root',
})
export class UohPayDeactivateGuard<T> implements CanDeactivate<T> {
  constructor(private deactivate: UohPayDeactivate) {}

  /**
   * Checks if a component that implements the deactivable interface can be deactivated.
   * @param component The deactivable component.
   * @param currentRoute The current route.
   * @param currentState The current router state.
   * @param nextState The next router state.
   */
  canDeactivate(
    component: T,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // Send a deactivation request to the page component using the service.
    this.deactivate.onRequest();

    // The deactivation logic resides in the page component itselft.
    // Return the response emitted by the page.
    return this.deactivate.response$;
  }
}
