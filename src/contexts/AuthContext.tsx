import {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { useFirebaseAuth, type UseFirebaseAuthResult } from '@sudobility/whisperly_lib';
import { auth } from '../services/firebase';

const AuthContext = createContext<UseFirebaseAuthResult | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useFirebaseAuth(auth);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): UseFirebaseAuthResult {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
