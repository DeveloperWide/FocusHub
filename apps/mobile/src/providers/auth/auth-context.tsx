import type {
  AuthenticatedUserResponse,
  SignupPayload,
  User,
} from '@focushub/contracts';
import { ApiClientError } from '@focushub/api-client';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { requireApiClient } from '@/foundation/api-client';
import {
  deleteAccessToken,
  getAccessToken,
  saveAccessToken,
} from '@/features/auth/secure-token-storage.native';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = SignupPayload;

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  login(input: LoginInput): Promise<void>;
  signup(input: SignupInput): Promise<void>;
  logout(): Promise<void>;
  checkUsername(username: string): Promise<{ available: boolean }>;
  suggestUsername(username: string): Promise<{ suggestions: string[] }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const isAuthenticationFailure = (error: unknown) =>
  error instanceof ApiClientError && (error.status === 401 || error.status === 403);

const getResponseUser = (response: AuthenticatedUserResponse) => response.user;

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof ApiClientError) {
    if (error.status === 400) return error.message;
    if (error.status === 401 || error.status === 403) return 'Your session is no longer valid.';
    if (error.status >= 500) return 'The server is unavailable right now.';
    return error.message || 'The request could not be completed.';
  }

  if (error instanceof TypeError) return 'Unable to reach FocusHub. Check your connection.';
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          if (!cancelled) setStatus('unauthenticated');
          return;
        }

        const response = await requireApiClient().auth.me();
        if (!cancelled) {
          setUser(response.user);
          setStatus('authenticated');
        }
      } catch (error) {
        if (isAuthenticationFailure(error)) {
          try {
            await deleteAccessToken();
          } catch {
            // The session is still invalid locally if cleanup fails.
          }
        }

        if (!cancelled) {
          setUser(null);
          setStatus('unauthenticated');
        }
      }
    };

    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (input: LoginInput) => {
    const response = await requireApiClient().auth.login(input);
    await saveAccessToken(response.token);
    setUser(getResponseUser(response));
    setStatus('authenticated');
  };

  const signup = async (input: SignupInput) => {
    const response = await requireApiClient().auth.signup(input);
    await saveAccessToken(response.token);
    setUser(getResponseUser(response));
    setStatus('authenticated');
  };

  const logout = async () => {
    try {
      await requireApiClient().auth.logout();
    } finally {
      await deleteAccessToken();
      setUser(null);
      setStatus('unauthenticated');
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isLoading: status === 'loading',
      isAuthenticated: status === 'authenticated',
      login,
      signup,
      logout,
      checkUsername: (username) => requireApiClient().auth.checkUsername(username),
      suggestUsername: (username) => requireApiClient().auth.suggestUsername(username),
    }),
    [status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
