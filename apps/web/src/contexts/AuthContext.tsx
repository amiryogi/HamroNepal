/**
 * Auth Context
 *
 * Provides authentication state throughout the app.
 */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Author } from "@/types";
import {
  getCurrentUser,
  getAuthorProfile,
  login as authLogin,
  logout as authLogout,
  type AuthUser,
  type LoginCredentials,
} from "@/services/auth.service";

interface AuthContextType {
  user: AuthUser | null;
  author: Author | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const authorProfile = await getAuthorProfile(currentUser.$id);
        setAuthor(authorProfile);
      } else {
        setUser(null);
        setAuthor(null);
      }
    } catch {
      setUser(null);
      setAuthor(null);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const loggedInUser = await authLogin(credentials);
    setUser(loggedInUser);

    const authorProfile = await getAuthorProfile(loggedInUser.$id);
    setAuthor(authorProfile);
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
    setAuthor(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshAuth();
      setIsLoading(false);
    };

    initAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        author,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Re-export useAuth from separate file to fix Fast Refresh warning
export { useAuth } from "./useAuth";
