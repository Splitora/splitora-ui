import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken, clearAuthTokens, authAPI } from '../utils/api';
import { AUTH_STATES } from '../utils/constants';

// Create context for global auth state
export const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(AUTH_STATES.LOGGED_OUT);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState('');

  // Check authentication status on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setAuthState(AUTH_STATES.LOGGED_IN);
    } else {
      setAuthState(AUTH_STATES.LOGGED_OUT);
    }
    setIsLoading(false);
  }, []);

  // Function to show login prompt
  const showLoginPromptModal = (message = 'Your session has expired. Please log in again.') => {
    setLoginPromptMessage(message);
    setShowLoginPrompt(true);
  };

  // Function to hide login prompt
  const hideLoginPromptModal = () => {
    setShowLoginPrompt(false);
    setLoginPromptMessage('');
  };

  // Function to handle logout
  const logout = async () => {
    try {
      // Call logout API endpoint (commented out since backend is not ready)
      // await authAPI.logout();
      
      // Clear tokens and update auth state
      clearAuthTokens();
      setAuthState(AUTH_STATES.LOGGED_OUT);
      setShowLoginPrompt(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local tokens
      clearAuthTokens();
      setAuthState(AUTH_STATES.LOGGED_OUT);
      setShowLoginPrompt(false);
    }
  };

  // Function to handle successful login
  const login = () => {
    setAuthState(AUTH_STATES.LOGGED_IN);
    setShowLoginPrompt(false);
  };

  const value = {
    authState,
    isLoading,
    setAuthState,
    showLoginPrompt,
    showLoginPromptModal,
    hideLoginPromptModal,
    loginPromptMessage,
    logout,
    login
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 