import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from '../../hooks/useAuthState';
import { AUTH_STATES } from '../../utils/constants';

const AuthRedirect = ({ children }) => {
  const { authState, isLoading } = useAuthState();

  // Wait for auth state to be loaded before making redirect decisions
  if (isLoading) {
    return children; // Show the page while loading
  }

  // If user is logged in, redirect to group page
  if (authState === AUTH_STATES.LOGGED_IN) {
    return <Navigate to="/group" replace />;
  }

  // If user is not logged in, show the children (home page)
  return children;
};

export default AuthRedirect; 