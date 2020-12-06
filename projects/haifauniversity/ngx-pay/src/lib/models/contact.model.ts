import { InjectionToken } from '@angular/core';

export interface UohPayContact {
  /**
   * The name of the contact.
   */
  name: string;
  /**
   * The e-mail address to which the user can send payment error messages.
   */
  email: string;
  /**
   * The website the user is referred to in case of error.
   */
  website: string;
}

export const UOH_PAY_CONTACT = new InjectionToken<UohPayContact>('The contact details in case of error');
