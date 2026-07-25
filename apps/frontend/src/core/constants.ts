/** App-wide constants and localStorage key registry */

const APP_PREFIX = 'carousel_marketplace';

export const REDUX_PREFIX = `${APP_PREFIX}_redux_`;
export const LOCALSTORAGE_PREFIX = `${APP_PREFIX}_`;

export const LOCALSTORAGE_KEYS = {
  token: `${APP_PREFIX}_token`,
  previousLink: `${APP_PREFIX}_previousLink`,
} as const;
