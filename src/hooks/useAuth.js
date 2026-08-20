import { useCallback, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';

function getStoredUser() {
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function persistAuth(token, user) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

function extractAuthPayload(response) {
  if (!response) return {};

  const token = response.token || response.accessToken || response.access_token || response.access_token;
  const user = response.user || response.profile || response;
  return { token, user };
}

export function useAuth() {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(Boolean(getStoredToken()));
  const [error, setError] = useState(null);

  const clearAuth = useCallback(() => {
    persistAuth(null, null);
    setUser(null);
    setToken(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const syncAuth = useCallback((authResponse) => {
    const { token: newToken, user: newUser } = extractAuthPayload(authResponse);
    persistAuth(newToken, newUser);
    setToken(newToken || null);
    setUser(newUser || null);
  }, []);

  const loadProfile = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const profile = await authService.getProfile();
      setUser(profile);
      persistAuth(currentToken, profile);
    } catch (err) {
      clearAuth();
      setError(err.message || 'Unable to load current user profile.');
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, [loadProfile, token]);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      syncAuth(response);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [syncAuth]);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      syncAuth(response);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [syncAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  // Dev-only helper: signs in as a mock user without hitting the backend,
  // for browsing authenticated pages while the API isn't running locally.
  const devLogin = useCallback(() => {
    const mockUser = { id: "dev-1", name: "Test User", email: "test@example.com" };
    persistAuth(null, mockUser);
    setUser(mockUser);
  }, []);

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    loadProfile,
    clearAuth,
    devLogin,
  };
}
