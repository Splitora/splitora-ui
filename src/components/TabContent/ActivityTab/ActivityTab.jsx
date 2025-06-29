import React from 'react';
import './ActivityTab.css';

const ActivityTab = () => {
  return (
    <div className="tab-content">
      <h2>Activity Feed</h2>
      <p>Track recent expenses and settlements.</p>
      
      <div className="activity-feed">
        <div className="activity-item">
          <div className="activity-icon">💰</div>
          <div className="activity-content">
            <h4>New expense added</h4>
            <p>Sarah paid $45 for groceries in Roommates group</p>
            <span className="activity-time">2 hours ago</span>
          </div>
        </div>
        
        <div className="activity-item">
          <div className="activity-icon">✅</div>
          <div className="activity-content">
            <h4>Settlement completed</h4>
            <p>You settled $25 with Mike in Weekend Trip group</p>
            <span className="activity-time">1 day ago</span>
          </div>
        </div>
        
        <div className="activity-item">
          <div className="activity-icon">👥</div>
          <div className="activity-content">
            <h4>New member joined</h4>
            <p>Alex joined the Weekend Trip group</p>
            <span className="activity-time">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTab; 