import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TabLayout.css';

const TabLayout = ({ children }) => {
  const { tabId } = useParams();
  const navigate = useNavigate();

  const tabs = [
    { id: 'group', label: 'Group', icon: '👥' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'activity', label: 'Activity', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  // Default to 'group' if no valid tabId is provided
  const activeTab = tabs.find(tab => tab.id === tabId) ? tabId : 'group';

  const handleTabClick = (tabId) => {
    navigate(`/${tabId}`);
  };

  const activeChild = React.Children.toArray(children).find(
    child => child.props.tabId === activeTab
  );

  return (
    <div className="tab-layout">
      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-container">
        {activeChild || <div className="tab-content">Tab content not found</div>}
      </div>
    </div>
  );
};

export default TabLayout; 