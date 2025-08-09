/**
 * Authentication utilities
 */

import { getAuthToken, getRefreshToken, clearAuthTokens } from './api.js';

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid tokens
 */
export const isAuthenticated = () => {
  const accessToken = getAuthToken();
  const refreshToken = getRefreshToken();
  
  return !!(accessToken && refreshToken);
};

/**
 * Check if access token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

/**
 * Get user information from token
 * @param {string} token - JWT token
 * @returns {Object|null} User information or null if invalid
 */
export const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub || payload.userId,
      email: payload.email,
      username: payload.username,
      roles: payload.roles || []
    };
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

/**
 * Logout user and clear all tokens
 */
export const logout = () => {
  clearAuthTokens();
  window.location.href = '/login';
};

/**
 * Check if user needs to refresh token
 * @returns {boolean} True if token should be refreshed
 */
export const shouldRefreshToken = () => {
  const accessToken = getAuthToken();
  if (!accessToken) return false;
  
  // Refresh token if it expires in the next 5 minutes
  const expiration = getTokenExpiration(accessToken);
  if (!expiration) return true;
  
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
  return expiration < fiveMinutesFromNow;
}; 