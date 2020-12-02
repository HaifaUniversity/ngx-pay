/**
 * The theme to be used in the payment page.
 */
export interface UohPayTheme {
  name: string;
  button: string;
  text: string;
  background: string;
}

export const UOH_PAY_DEFAULT_THEME: UohPayTheme = {
  name: 'default',
  button: '0664aa',
  text: '333333',
  background: 'ffffff',
};

export const UOH_PAY_DARK_THEME: UohPayTheme = { name: 'dark', button: '0664aa', text: 'ffffff', background: '424242' };
