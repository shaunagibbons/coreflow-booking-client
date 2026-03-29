import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/data/authService';
import { tokenStorage } from '@/data/api';
import type { LoginRequest, RegisterRequest, User } from '@/data/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  // Hydrate auth state on mount
  useEffect(() => {
    const token = tokenStorage.getAccess();
    if (!token) {
      setState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    authService
      .getProfile()
      .then((user) => {
        setState({ user, isAuthenticated: true, isLoading: false });
      })
      .catch(() => {
        tokenStorage.clear();
        setState({ user: null, isAuthenticated: false, isLoading: false });
      });
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      await authService.login(data);
      const user = await authService.getProfile();
      setState({ user, isAuthenticated: true, isLoading: false });
      navigate('/');
    },
    [navigate],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      await authService.register(data);
      await authService.login({ email: data.email, password: data.password });
      const user = await authService.getProfile();
      setState({ user, isAuthenticated: true, isLoading: false });
      navigate('/');
    },
    [navigate],
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    setState({ user: null, isAuthenticated: false, isLoading: false });
    navigate('/login');
  }, [navigate]);

  const updateUser = useCallback((user: User) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
