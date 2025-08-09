/**
 * API Service Module
 * Handles all API calls with proper error handling and authentication
 * Uses Axios for HTTP requests
 */

import axios from 'axios';

import { API_BASE_URL, STORAGE_KEYS } from './constants.js';

// Global variable to store the login prompt trigger function
let triggerLoginPrompt = null;

// Function to set the login prompt trigger (called from App.jsx)
export const setLoginPromptTrigger = (triggerFn) => {
  triggerLoginPrompt = triggerFn;
};

/**
 * Create Axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Get authentication token from localStorage
 * @returns {string|null} The authentication token
 */
const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
};

/**
 * Set authentication token in localStorage
 * @param {string} token - The authentication token
 */
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
  }
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} The refresh token
 */
const getRefreshToken = () => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Set refresh token in localStorage
 * @param {string} token - The refresh token
 */
const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
};

/**
 * Clear all authentication tokens
 */
const clearAuthTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Request interceptor to add authentication token and logging
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common errors, logging, and token refresh
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    
    // Extract data from response.data.data structure
    // If response.data has a data property, return that, otherwise return response.data
    return response.data.data !== undefined ? response.data.data : response.data;
  },
  async (error) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
        isNetworkError: error.isNetworkError,
        response: error.response
      });
    }
    
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // No refresh token available, trigger login prompt
          clearAuthTokens();
          if (triggerLoginPrompt) {
            triggerLoginPrompt('No refresh token available. Please log in again.');
          } else {
            // Fallback to redirect if trigger not set
            window.location.href = '/login';
          }
          return Promise.reject(new Error('No refresh token available'));
        }
        
        console.log('🔄 Attempting to refresh token...');
        
        // Call refresh token endpoint
        const refreshResponse = await apiClient.post('/auth/refresh', {
          refreshToken: refreshToken
        });
        
        // Extract tokens from response
        const { accessToken, refreshToken: newRefreshToken } = refreshResponse;
        
        if (accessToken) {
          // Store new tokens
          setAuthToken(accessToken);
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
          }
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          console.log('✅ Token refreshed successfully');
          
          // Retry the original request
          return apiClient(originalRequest);
        } else {
          throw new Error('No access token received from refresh');
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Clear tokens and trigger login prompt
        clearAuthTokens();
        if (triggerLoginPrompt) {
          triggerLoginPrompt('Your session has expired. Please log in again.');
        } else {
          // Fallback to redirect if trigger not set
          window.location.href = '/login';
        }
        
        return Promise.reject(new Error('Token refresh failed'));
      }
    }
    
    let errorMessage = 'An error occurred';
    
    if (error.response) {
      // Server responded with error status
      const { data, status, statusText } = error.response;
      
      // Extract error message from data.message or data.error
      // Handle both direct properties and nested data structure
      const responseData = data?.data || data;
      errorMessage = responseData?.message || responseData?.error || data?.message || data?.error || statusText || errorMessage;
      
      const customError = new Error(errorMessage);
      customError.status = status;
      customError.statusText = statusText;
      customError.response = error.response;
      return Promise.reject(customError);
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error. Please check your connection.';
      const customError = new Error(errorMessage);
      customError.isNetworkError = true;
      return Promise.reject(customError);
    } else {
      // Something else happened
      errorMessage = error.message || errorMessage;
      return Promise.reject(new Error(errorMessage));
    }
  }
);

/**
 * Make an API request using Axios
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} config - Axios request configuration
 * @returns {Promise<Object>} API response
 */
const apiRequest = async (endpoint, config = {}) => {
  try {
    const response = await apiClient.request({
      url: endpoint,
      ...config
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * API Service Methods
 */
export const apiService = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} API response
   */
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      method: 'GET',
      ...options
    });
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} config - Axios request configuration
   * @returns {Promise<Object>} API response
   */
  post: (endpoint, data = null, config = {}) => {
    return apiRequest(endpoint, {
      method: 'POST',
      data,
      ...config
    });
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} config - Axios request configuration
   * @returns {Promise<Object>} API response
   */
  put: (endpoint, data = null, config = {}) => {
    return apiRequest(endpoint, {
      method: 'PUT',
      data,
      ...config
    });
  },

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} config - Axios request configuration
   * @returns {Promise<Object>} API response
   */
  patch: (endpoint, data = null, config = {}) => {
    return apiRequest(endpoint, {
      method: 'PATCH',
      data,
      ...config
    });
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} config - Axios request configuration
   * @returns {Promise<Object>} API response
   */
  delete: (endpoint, config = {}) => {
    return apiRequest(endpoint, {
      method: 'DELETE',
      ...config
    });
  }
};

/**
 * Authentication API methods
 */
export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @returns {Promise<Object>} Login response
   */
  login: async (credentials) => {
    const response = await apiService.post('/auth/login', credentials);
    if (response.accessToken) {
      setAuthToken(response.accessToken);
    }
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken);
    }
    return response;
  },

  /**
   * Register user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  register: async (userData) => {
    const response = await apiService.post('/auth/register', userData);
    if (response.accessToken) {
      setAuthToken(response.accessToken);
    }
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken);
    }
    return response;
  },

  /**
   * Logout user
   * @returns {Promise<Object>} Logout response
   */
  logout: async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await apiService.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      clearAuthTokens();
    }
  },

  /**
   * Refresh access token
   * @returns {Promise<Object>} Refresh response
   */
  refreshToken: async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiService.post('/auth/refresh', { refreshToken });
    
    if (response.accessToken) {
      setAuthToken(response.accessToken);
    }
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken);
    }
    
    return response;
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  getProfile: () => {
    return apiService.get('/user');
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile
   */
  updateProfile: (profileData) => {
    return apiService.put('/auth/profile', profileData);
  }
};

/**
 * Groups API methods
 */
export const groupsAPI = {
  /**
   * Get all groups for current user
   * @returns {Promise<Array>} List of groups
   */
  getGroups: () => {
    return apiService.get('/group');
  },

  /**
   * Get specific group by ID
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Group details
   */
  getGroup: (groupId) => {
    return apiService.get(`/group/${groupId}`);
  },

  /**
   * Create new group
   * @param {Object} groupData - Group data
   * @returns {Promise<Object>} Created group
   */
  createGroup: (groupData) => {
    return apiService.post('/group/create', groupData);
  },

  /**
   * Update group
   * @param {string} groupId - Group ID
   * @param {Object} groupData - Updated group data
   * @returns {Promise<Object>} Updated group
   */
  updateGroup: (groupId, groupData) => {
    return apiService.put(`/group/${groupId}`, groupData);
  },

  /**
   * Delete group
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Deletion response
   */
  deleteGroup: (groupId) => {
    return apiService.delete(`/group/delete`, {
      params: { groupId }
    });
  },

  /**
   * Add member to group
   * @param {string} groupId - Group ID
   * @param {Object} memberData - Member data with different formats for email/phone
   * @returns {Promise<Object>} Response
   */
  addMembers: (groupId, memberData) => {
    return apiService.post(`/group/add-member/${groupId}`, memberData);
  },

  /**
   * Remove member from group
   * @param {string} groupId - Group ID
   * @param {string} memberId - Member ID
   * @returns {Promise<Object>} Response
   */
  removeMember: (groupId, memberId) => {
    return apiService.delete(`/group/${groupId}/members/${memberId}`);
  }
};

/**
 * Expenses API methods
 */
export const expensesAPI = {
  /**
   * Get expenses for a group
   * @param {string} groupId - Group ID
   * @returns {Promise<Array>} List of expenses
   */
  getExpenses: (groupId) => {
    return apiService.get(`/expense/group/${groupId}`);
  },

  /**
   * Create new expense
   * @param {string} groupId - Group ID
   * @param {Object} expenseData - Expense data
   * @returns {Promise<Object>} Created expense
   */
  createExpense: (groupId, expenseData) => {
    return apiService.post(`/expense/create/${groupId}`, expenseData);
  },

  /**
   * Update expense
   * @param {string} groupId - Group ID
   * @param {string} expenseId - Expense ID
   * @param {Object} expenseData - Updated expense data
   * @returns {Promise<Object>} Updated expense
   */
  updateExpense: (groupId, expenseId, expenseData) => {
    return apiService.put(`/group/${groupId}/expenses/${expenseId}`, expenseData);
  },

  /**
   * Delete expense
   * @param {string} groupId - Group ID
   * @param {string} expenseId - Expense ID
   * @returns {Promise<Object>} Deletion response
   */
  deleteExpense: (expenseId) => {
    return apiService.delete(`/expense/delete/${expenseId}`);
  },

  /**
   * Add debtors to an expense
   * @param {string} expenseId - Expense ID
   * @param {Array<string>} debtorIds - Array of debtor member IDs
   * @returns {Promise<Object>} Response
   */
  addDebtors: (expenseId, debtorIds) => {
    return apiService.post(`/expense/add-ower/${expenseId}`,  debtorIds);
  }
};

/**
 * Settlements API methods
 */
export const settlementsAPI = {
  /**
   * Get settlements for a group
   * @param {string} groupId - Group ID
   * @returns {Promise<Array>} List of settlements
   */
  getSettlements: (groupId) => {
    return apiService.get(`/group/getBalanceTransactions/${groupId}`);
  },

  /**
   * Mark settlement as paid
   * @param {string} groupId - Group ID
   * @param {string} settlementId - Settlement ID
   * @returns {Promise<Object>} Updated settlement
   */
  markAsPaid: (groupId, settlementId) => {
    return apiService.patch(`/group/${groupId}/settlements/${settlementId}`, {
      status: 'paid'
    });
  }
};

// Export utility functions for external use
export { 
  getAuthToken, 
  setAuthToken, 
  getRefreshToken, 
  setRefreshToken, 
  clearAuthTokens 
};

/**
 * Utility function to get the full response structure (for debugging)
 * @param {string} endpoint - API endpoint
 * @param {Object} config - Axios request configuration
 * @returns {Promise<Object>} Full response with wrapper structure
 */
export const getFullResponse = async (endpoint, config = {}) => {
  try {
    const response = await apiClient.request({
      url: endpoint,
      ...config
    });
    return response.data; // Return the full response structure
  } catch (error) {
    throw error;
  }
}; 