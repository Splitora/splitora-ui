import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Button';
import './ProfileTab.css';

const ProfileTab = () => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="tab-content">
      <div className="profile-header">
        <div className="user-id">ID: #12345</div>
        <h2>User Profile</h2>
      </div>
      <p>View your personal information and preferences.</p>
      
      <div className="profile-section">
        <div className="profile-avatar">
          <div className="avatar-placeholder">👤</div>
          <p className="avatar-text">Profile Photo</p>
        </div>
        
        <div className="profile-info">
          <div className="info-item">
            <label>Username</label>
            <div className="info-value">johndoe</div>
          </div>
          <div className="info-item">
            <label>Email</label>
            <div className="info-value">john.doe@example.com</div>
          </div>
          <div className="info-item">
            <label>Phone Number</label>
            <div className="info-value">+1 (555) 123-4567</div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <Button 
          variant="primary" 
          size="medium"
          onClick={handleEditProfile}
          className="edit-profile-btn"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileTab; 