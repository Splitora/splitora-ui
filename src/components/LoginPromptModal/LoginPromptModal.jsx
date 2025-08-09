import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../../hooks/useAuthState';
import { authAPI } from '../../utils/api';
import Button from '../Button';
import './LoginPromptModal.css';

const LoginPromptModal = () => {
  const navigate = useNavigate();
  const { showLoginPrompt, hideLoginPromptModal, loginPromptMessage, login } = useAuthState();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await authAPI.login(credentials);
      login(); // Update auth state
      
      // Optionally refresh the current page or navigate
      window.location.reload();
      
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    hideLoginPromptModal();
    navigate('/login');
  };

  if (!showLoginPrompt) {
    return null;
  }

  return (
    <div className="login-prompt-backdrop">
      <div className="login-prompt-modal">
        <div className="login-prompt-header">
          <h2>Session Expired</h2>
          <p>{loginPromptMessage}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-prompt-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="login-prompt-actions">
            <Button
              type="button"
              variant="ghost"
              size="medium"
              onClick={handleLogout}
              disabled={isLoading}
            >
              Logout
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPromptModal; 