import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Button';
import { useAuth } from '../../../hooks';
import './ProfileTab.css';

const ProfileTab = () => {
  const navigate = useNavigate();
  const { getProfile } = useAuth();
  
  const [profileData, setProfileData] = useState({
    userId: '',
    username: '',
    email: '',
    phone: {
      countryCode: '',
      phoneNumber: ''
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await getProfile.execute();
        console.log('Profile data fetched:', profile);
        setProfileData(profile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // You might want to show an error message to the user here
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };



  if (isLoading) {
    return (
      <div className="tab-content">
        <div className="profile-header">
          <h2>User Profile</h2>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile information...</p>
        </div>
      </div>
    );
  }

  if (getProfile.error) {
    return (
      <div className="tab-content">
        <div className="profile-header">
          <h2>User Profile</h2>
        </div>
        <div className="error-container">
          <p className="error-message">Failed to load profile information</p>
          <Button 
            variant="secondary" 
            size="medium"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="profile-header">
        <div className="user-id">ID: {profileData.userId || 'N/A'}</div>
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
            <div className="info-value">{profileData.username || 'N/A'}</div>
          </div>
          <div className="info-item">
            <label>Email</label>
            <div className="info-value">{profileData.email || 'N/A'}</div>
          </div>
          <div className="info-item">
            <label>Phone Number</label>
            <div className="info-value">{profileData.phone.countryCode + ' ' + profileData.phone.phoneNumber || 'N/A'}</div>
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