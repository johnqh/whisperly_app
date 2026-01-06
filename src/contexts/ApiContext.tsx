import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import { networkClient } from '@sudobility/di';
import type { NetworkClient } from '@sudobility/types';
import { useAuth } from './AuthContext';

interface ApiContextValue {
  networkClient: NetworkClient;
  baseUrl: string;
  token: string | null;
  isReady: boolean;
  isLoading: boolean;
}

const ApiContext = createContext<ApiContextValue | null>(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export function ApiProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, getIdToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchToken = async () => {
      if (!user) {
        setToken(null);
        setTokenLoading(false);
        return;
      }

      setTokenLoading(true);
      try {
        const idToken = await getIdToken();
        if (mounted && idToken) {
          setToken(idToken);
        }
      } catch {
        if (mounted) setToken(null);
      } finally {
        if (mounted) setTokenLoading(false);
      }
    };

    fetchToken();

    return () => {
      mounted = false;
    };
  }, [user, getIdToken]);

  const value = useMemo<ApiContextValue>(
    () => ({
      networkClient,
      baseUrl: API_BASE_URL,
      token,
      isReady: !!user && !!token,
      isLoading: authLoading || tokenLoading,
    }),
    [user, token, authLoading, tokenLoading]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiContextValue {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
