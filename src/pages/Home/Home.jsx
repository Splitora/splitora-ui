import React from 'react';
import { TabLayout, TabContent } from '../../components';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-header">
        <h1>Splitora</h1>
        <p className="home-subtitle">
          Manage group expenses, track balances, and settle debts
        </p>
      </div>

      <TabLayout>
        <TabContent.GroupTab tabId="group" />
        <TabContent.ProfileTab tabId="profile" />
        <TabContent.ActivityTab tabId="activity" />
        <TabContent.SettingsTab tabId="settings" />
      </TabLayout>
    </div>
  );
};

export default Home; 