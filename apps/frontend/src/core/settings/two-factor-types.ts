/**
 * 2FA setup/disable state machines.
 *
 * Defined in core/ because both the security store module and the module's
 * hook need them, and store/ may not import from modules/.
 */
export type SetupStep =
  | 'idle'
  | 'initializing'
  | 'show-qr'
  | 'show-email-input'
  | 'verifying'
  | 'success';

export type DisableStep = 'idle' | 'submitting' | 'success';
