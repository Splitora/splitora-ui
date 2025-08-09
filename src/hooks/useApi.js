/**
 * Custom hook for API calls with loading states and error handling
 */

import { useState, useCallback } from 'react';
import { apiService, authAPI, groupsAPI, expensesAPI, settlementsAPI } from '../utils/api.js';

/**
 * Custom hook for making API calls with state management
 * @param {Function} apiCall - The API function to call
 * @returns {Object} Object containing loading state, error state, data, and execute function
 */
export const useApiCall = (apiCall) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return {
    loading,
    error,
    data,
    execute
  };
};

/**
 * Hook for authentication API calls
 */
export const useAuth = () => {
  const login = useApiCall(authAPI.login);
  const register = useApiCall(authAPI.register);
  const logout = useApiCall(authAPI.logout);
  const refreshToken = useApiCall(authAPI.refreshToken);
  const getProfile = useApiCall(authAPI.getProfile);
  const updateProfile = useApiCall(authAPI.updateProfile);

  return {
    login,
    register,
    logout,
    refreshToken,
    getProfile,
    updateProfile
  };
};

/**
 * Hook for groups API calls
 */
export const useGroups = () => {
  const getGroups = useApiCall(groupsAPI.getGroups);
  const getGroup = useApiCall(groupsAPI.getGroup);
  const createGroup = useApiCall(groupsAPI.createGroup);
  const updateGroup = useApiCall(groupsAPI.updateGroup);
  const deleteGroup = useApiCall(groupsAPI.deleteGroup);
  const addMembers = useApiCall(groupsAPI.addMembers);
  const removeMember = useApiCall(groupsAPI.removeMember);

  return {
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    addMembers,
    removeMember
  };
};

/**
 * Hook for expenses API calls
 */
export const useExpenses = () => {
  const getExpenses = useApiCall(expensesAPI.getExpenses);
  const createExpense = useApiCall(expensesAPI.createExpense);
  const updateExpense = useApiCall(expensesAPI.updateExpense);
  const deleteExpense = useApiCall(expensesAPI.deleteExpense);
  const addDebtors = useApiCall(expensesAPI.addDebtors);

  return {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    addDebtors
  };
};

/**
 * Hook for settlements API calls
 */
export const useSettlements = () => {
  const getSettlements = useApiCall(settlementsAPI.getSettlements);
  const markAsPaid = useApiCall(settlementsAPI.markAsPaid);

  return {
    getSettlements,
    markAsPaid
  };
};

/**
 * Hook for generic API calls
 */
export const useApi = () => {
  return {
    get: useApiCall(apiService.get),
    post: useApiCall(apiService.post),
    put: useApiCall(apiService.put),
    patch: useApiCall(apiService.patch),
    delete: useApiCall(apiService.delete)
  };
}; 