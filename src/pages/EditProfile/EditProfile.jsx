import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?\d{7,15}$/.test(formData.phone.replace(/[-\s()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual profile update API call
      console.log('Profile update attempt:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Handle successful update
      console.log('Profile updated successfully');
      
      // Navigate back to profile tab
      navigate('/profile');
      
    } catch (error) {
      console.error('Profile update failed:', error);
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <h2>Edit Profile</h2>
          <p>Update your personal information</p>
        </div>

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="profile-avatar-section">
            <div className="avatar-placeholder">👤</div>
            <Button variant="secondary" size="small">
              Change Photo
            </Button>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="ghost"
              size="medium"
              onClick={handleCancel}
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={isLoading}
              className="save-btn"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 