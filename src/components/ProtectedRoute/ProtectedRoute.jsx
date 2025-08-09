import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../../hooks/useAuthState';
import { AUTH_STATES } from '../../utils/constants';

const ProtectedRoute = ({ children }) => {
  const { authState, isLoading } = useAuthState();
  const location = useLocation();

  // Wait for auth state to be loaded before making redirect decisions
  if (isLoading) {
    return children; // Show the page while loading
  }

  // If user is not logged in, redirect to home page
  if (authState === AUTH_STATES.LOGGED_OUT) {
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  // If user is logged in, render the protected content
  return children;
};

export default ProtectedRoute; 