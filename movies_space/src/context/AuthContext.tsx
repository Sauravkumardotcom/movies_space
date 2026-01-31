import React, { createContext, useContext } from 'react';
import { useAuth, User } from '../hooks/useAuth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  adminLogin: (password: string) => Promise<void>;
  userLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdminAuthenticated: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use AuthContext
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
