/**
 * Custom hook for authentication state management
 */

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Hook to use auth context
export const useAuthState = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
}; 