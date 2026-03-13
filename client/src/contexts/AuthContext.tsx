import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { signin, signup, type AuthResponse } from "@/api/authApi";
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser as readStoredUser,
  setStoredAuth,
} from "@/lib/authStorage";

export interface AuthUser {
  id: number;
  email: string;
  created_at?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function persistAuth(auth: AuthResponse | null) {
  if (!auth) {
    clearStoredAuth();
    return;
  }

  setStoredAuth(auth.token, JSON.stringify(auth.user));
}

function getStoredUser(): AuthUser | null {
  const rawUser = readStoredUser();
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToken(getStoredToken());
    setUser(getStoredUser());
    setLoading(false);
  }, []);

  const applyAuth = (auth: AuthResponse) => {
    persistAuth(auth);
    setToken(auth.token);
    setUser(auth.user);
  };

  const handleAuthAction = async (
    action: Promise<AuthResponse>,
  ): Promise<{ error: Error | null }> => {
    try {
      const auth = await action;
      applyAuth(auth);
      return { error: null };
    } catch (error) {
      const authError =
        error instanceof Error ? error : new Error("Authentication failed");
      return { error: authError };
    }
  };

  const signUp = (email: string, password: string) =>
    handleAuthAction(signup(email, password));

  const signIn = (email: string, password: string) =>
    handleAuthAction(signin(email, password));

  const signOut = () => {
    persistAuth(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
