import React from 'react';
import Button  from '../../Button';
import './GroupTab.css';

const GroupTab = () => {
  return (
    <div className="tab-content">
      <h2>Group Management</h2>
      <p>Manage your expense groups and track shared expenses.</p>
      
      <div className="group-actions">
        <Button variant="primary" size="large">
          Create New Group
        </Button>
      </div>

      <div className="groups-list">
        <h3>Your Groups</h3>
        <div className="group-item">
          <div className="group-info">
            <h4>🏠 Roommates</h4>
            <p>4 members • $1,250 total expenses</p>
          </div>
          <Button variant="ghost" size="small">
            View Details
          </Button>
        </div>
        
        <div className="group-item">
          <div className="group-info">
            <h4>🍕 Weekend Trip</h4>
            <p>6 members • $850 total expenses</p>
          </div>
          <Button variant="ghost" size="small">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupTab; 