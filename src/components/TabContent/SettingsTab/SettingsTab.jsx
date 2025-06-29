import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Button';
import './SettingsTab.css';

const SettingsTab = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement actual logout logic (clear tokens, session, etc.)
    console.log('Logging out...');
    
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Navigate to login page
    navigate('/login');
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