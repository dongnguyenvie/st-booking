import { getDispatch } from '@/store/store-core';
import { authSliceActions as A } from './auth-slice';
import {
  useSignInMutation,
  useSignInByAuth0Mutation,
  useRegisterUserMutation,
  useVerifyTwoFactorMutation,
  useResendTwoFactorEmailMutation,
  useMyAccessQuery,
} from '@/api-service/generated/graphql-hooks.generated';
import type {
  SignInInput,
  RegisterUserInput,
  TwoFactorMethod,
} from '@/api-service/generated/graphql.generated';

// ==========================================================================================

type Callbacks = {
  onSuccess?: (user?: { privileges: number[]; roles?: string[] }) => void;
  onError?: (msg: string) => void;
};
type TwoFactorRequiredResult = { twoFactorRequired: true };

/** Resolve the signed-in user's roles + permissions (best-effort). */
async function loadAccess(): Promise<{ roles: string[]; permissions: string[] }> {
  try {
    const res = await useMyAccessQuery.fetcher()();
    return { roles: res.myAccess.data.roles, permissions: res.myAccess.data.permissions };
  } catch {
    return { roles: [], permissions: [] };
  }
}

/**
 * Persist internal JWT:
 * - localStorage  → picked up by graphql-client for API requests
 * - session_token cookie → read by Edge middleware for route protection
 */
function persistToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('carousel_marketplace_token', token);
  // Accessible by Edge middleware (not HttpOnly so JS can clear it on logout)
  document.cookie = `session_token=${token}; path=/; SameSite=Lax`;
}

function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('carousel_marketplace_token');
  // Expire the cookie immediately
  document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

// ==========================================================================================
// Extended thunk actions (called via dispatch from components or callbacks)
// ==========================================================================================

/** Sign in with email and password. Returns { twoFactorRequired: true } when 2FA challenge is needed. */
const signIn =
  (input: SignInInput, callbacks: Callbacks & { onTwoFactorRequired?: () => void } = {}) =>
  async (): Promise<TwoFactorRequiredResult | undefined> => {
    const dispatch = getDispatch();
    dispatch(A.pushLoading());
    dispatch(A.setError(null));
    try {
      const data = await useSignInMutation.fetcher({ input })();
      const { accessToken, user, twoFactorRequired, preAuthToken, twoFactorMethod } = data.signIn.data;

      if (twoFactorRequired && preAuthToken && twoFactorMethod) {
        dispatch(
          A.setTwoFactorChallenge({
            preAuthToken,
            method: twoFactorMethod as TwoFactorMethod,
            email: input.email,
          }),
        );
        callbacks.onTwoFactorRequired?.();
        return { twoFactorRequired: true };
      }

      if (!accessToken || !user) return;
      persistToken(accessToken);
      const access = await loadAccess();
      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        privileges: user.privileges ?? [],
        ...access,
      };
      dispatch(A.setCredentials({ token: accessToken, user: authUser }));
      callbacks.onSuccess?.(authUser);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { errors?: Array<{ message: string }> }; message?: string })?.response
          ?.errors?.[0]?.message ??
        (err as { message?: string })?.message ??
        'Sign in failed';
      dispatch(A.setError(msg));
      callbacks.onError?.(msg);
    } finally {
      dispatch(A.popLoading());
    }
  };

/**
 * Verify 2FA code using the pre-auth token stored in Redux state.
 * On success: persists real JWT, clears challenge, calls onSuccess.
 * On failure: sets error, calls onError.
 */
const verifyTwoFactor =
  (code: string, preAuthToken: string, callbacks: Callbacks = {}) =>
  async () => {
    const dispatch = getDispatch();
    dispatch(A.pushLoading());
    dispatch(A.setError(null));
    try {
      const data = await useVerifyTwoFactorMutation.fetcher({ input: { code, preAuthToken } })();
      const { accessToken, user } = data.verifyTwoFactor.data;
      persistToken(accessToken);
      const access = await loadAccess();
      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        privileges: user.privileges ?? [],
        ...access,
      };
      dispatch(A.setCredentials({ token: accessToken, user: authUser }));
      dispatch(A.clearTwoFactorChallenge());
      callbacks.onSuccess?.(authUser);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { errors?: Array<{ message: string }> }; message?: string })?.response
          ?.errors?.[0]?.message ??
        (err as { message?: string })?.message ??
        'Verification failed';
      dispatch(A.setError(msg));
      callbacks.onError?.(msg);
    } finally {
      dispatch(A.popLoading());
    }
  };

/** Resend 2FA email code. EMAIL method only. */
const resendTwoFactorEmail =
  (preAuthToken: string, callbacks: { onSuccess?: () => void; onError?: (msg: string) => void } = {}) =>
  async () => {
    const dispatch = getDispatch();
    try {
      await useResendTwoFactorEmailMutation.fetcher({ input: { preAuthToken } })();
      callbacks.onSuccess?.();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { errors?: Array<{ message: string }> }; message?: string })?.response
          ?.errors?.[0]?.message ??
        (err as { message?: string })?.message ??
        'Resend failed';
      dispatch(A.setError(msg));
      callbacks.onError?.(msg);
    }
  };

/**
 * Exchange Auth0 access token for an internal JWT.
 * Called after Auth0 Universal Login redirects back to /auth/callback.
 */
const signInByAuth0 =
  (auth0AccessToken: string, callbacks: Callbacks = {}) =>
  async () => {
    const dispatch = getDispatch();
    dispatch(A.pushLoading());
    dispatch(A.setError(null));
    try {
      const data = await useSignInByAuth0Mutation.fetcher({
        input: { accessToken: auth0AccessToken },
      })();

      const { accessToken, user } = data.signInByAuth0.data;
      persistToken(accessToken);
      const access = await loadAccess();
      const authUser = { ...user, privileges: user.privileges ?? [], ...access };
      dispatch(A.setCredentials({ token: accessToken, user: authUser }));
      callbacks.onSuccess?.(authUser);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { errors?: Array<{ message: string }> }; message?: string })?.response
          ?.errors?.[0]?.message ??
        (err as { message?: string })?.message ??
        'Sign in failed';
      dispatch(A.setError(msg));
      callbacks.onError?.(msg);
    } finally {
      dispatch(A.popLoading());
    }
  };

/**
 * Register a new user (creates account in Auth0 + local DB, returns internal JWT).
 */
const register =
  (input: RegisterUserInput, callbacks: Callbacks = {}) =>
  async () => {
    const dispatch = getDispatch();
    dispatch(A.pushLoading());
    dispatch(A.setError(null));
    try {
      const data = await useRegisterUserMutation.fetcher({ input })();

      const { accessToken, user } = data.registerUser.data;
      persistToken(accessToken);
      const access = await loadAccess();
      const authUser = { ...user, privileges: user.privileges ?? [], ...access };
      dispatch(A.setCredentials({ token: accessToken, user: authUser }));
      callbacks.onSuccess?.(authUser);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { errors?: Array<{ message: string }> }; message?: string })?.response
          ?.errors?.[0]?.message ??
        (err as { message?: string })?.message ??
        'Registration failed';
      dispatch(A.setError(msg));
      callbacks.onError?.(msg);
    } finally {
      dispatch(A.popLoading());
    }
  };

/** Clear session — removes token from store and localStorage */
const logout = () => async () => {
  const dispatch = getDispatch();
  clearToken();
  dispatch(A.clearCredentials());
  dispatch(A.clearTwoFactorChallenge());
};

// ==========================================================================================

export const authExtendActions = {
  signIn,
  signInByAuth0,
  register,
  logout,
  verifyTwoFactor,
  resendTwoFactorEmail,
};
