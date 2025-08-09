import React from 'react';
import { useParams } from 'react-router-dom';
import { TabContent } from '../../components';
import './Home.css';

const Home = () => {
  const { tabId } = useParams();

  // Render only the active tab based on the current route
  const renderActiveTab = () => {
    switch (tabId) {
      case 'group':
        return <TabContent.GroupTab />;
      case 'profile':
        return <TabContent.ProfileTab />;
      case 'activity':
        return <TabContent.ActivityTab />;
      case 'settings':
        return <TabContent.SettingsTab />;
      default:
        return <TabContent.GroupTab />;
    }
  };

  return (
    <>
      {renderActiveTab()}
    </>
  );
};

export default Home; 