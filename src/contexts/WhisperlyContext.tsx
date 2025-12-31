import { createContext, useContext, ReactNode } from 'react';
import { useWhisperlyClient, WhisperlyClient } from '@sudobility/whisperly_lib';
import { useAuth } from './AuthContext';

const WhisperlyContext = createContext<WhisperlyClient | null>(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export function WhisperlyProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  const client = useWhisperlyClient({
    baseUrl: API_BASE_URL,
    auth,
  });

  return (
    <WhisperlyContext.Provider value={client}>
      {children}
    </WhisperlyContext.Provider>
  );
}

export function useWhisperly(): WhisperlyClient {
  const context = useContext(WhisperlyContext);
  if (!context) {
    throw new Error('useWhisperly must be used within a WhisperlyProvider');
  }
  return context;
}
