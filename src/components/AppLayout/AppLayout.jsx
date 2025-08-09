import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './AppLayout.css';

const AppLayout = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract tabId from the current pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const tabId = pathSegments[0]; // First segment after the domain

  // Only show sidebar for tab routes (not for login, signup, home, etc.)
  const isTabRoute = ['group', 'profile', 'activity', 'settings'].includes(tabId);
  const shouldShowSidebar = isTabRoute;

  // Close sidebar on mobile when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const isMobile = window.innerWidth <= 480;
      
      if (isMobile && isSidebarExpanded && sidebar && !sidebar.contains(event.target)) {
        setIsSidebarExpanded(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isSidebarExpanded) {
        setIsSidebarExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarExpanded]);

  const tabs = [
    { id: 'group', label: 'Group', icon: '👥' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'activity', label: 'Activity', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  // Determine the active tab based on the current route
  // Only highlight a tab if we're actually on a tab route
  const activeTab = isTabRoute && tabs.find(tab => tab.id === tabId) ? tabId : null;

  const handleTabClick = (tabId) => {
    navigate(`/${tabId}`);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="app-layout">
      {/* Top Navigation Bar - Always visible for all routes */}
      <nav className="top-navbar">
        <div className="navbar-left">
          {shouldShowSidebar && (
            <button 
              className="menu-toggle"
              onClick={toggleSidebar}
              aria-label={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <span className={`menu-icon ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>☰</span>
            </button>
          )}
          <h1 className="navbar-title">Splitora</h1>
        </div>
        <div className="navbar-right">
          {/* Add any additional navbar items here */}
        </div>
      </nav>

      {/* Sidebar - Only show for tab routes */}
      {shouldShowSidebar && (
        <div className={`sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <nav className="sidebar-navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
                title={!isSidebarExpanded ? tab.label : ''}
              >
                <span className="tab-icon">{tab.icon}</span>
                {isSidebarExpanded && <span className="tab-label">{tab.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className={`main-content ${shouldShowSidebar ? (isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed') : 'no-sidebar'}`}>
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout; 