import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Button';
import { useAuthState } from '../../../hooks/useAuthState';
import { authAPI } from '../../../utils/api';
import './SettingsTab.css';

const SettingsTab = () => {
  const navigate = useNavigate();
  const { logout } = useAuthState();

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      
      // Call logout API endpoint (commented out since backend is not ready)
      // await authAPI.logout();
      
      // Clear tokens and update auth state
      logout();
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local tokens and redirect
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="tab-content">
      <h2>Settings</h2>
      <p>Customize your Splitora experience.</p>
      
      <div className="settings-section">
        <h3>Preferences</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <h4>Theme</h4>
            <p>Choose your preferred color theme</p>
          </div>
          <select defaultValue="dark">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <h4>Notifications</h4>
            <p>Receive notifications for new expenses</p>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <h4>Currency Display</h4>
            <p>Show currency symbol with amounts</p>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Account</h3>
        <Button variant="secondary" size="medium">
          Change Password
        </Button>
        <Button variant="ghost" size="medium">
          Export Data
        </Button>
      </div>

      <div className="settings-section">
        <h3>Session</h3>
        <Button 
          variant="ghost" 
          size="medium" 
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SettingsTab; 