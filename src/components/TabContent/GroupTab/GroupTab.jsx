import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Button';
import CreateGroupDialog from './CreateGroupDialog';
import { useGroups } from '../../../hooks';
import './GroupTab.css';

const GroupTab = () => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const { getGroups, createGroup } = useGroups();
  
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const groupsData = await getGroups.execute();
        console.log('Groups fetched:', groupsData);
        setGroups(groupsData.groups || []);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        setGroups([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleOpenDialog = () => setShowDialog(true);
  const handleCloseDialog = () => setShowDialog(false);
  
  const handleCreateGroup = async (groupName) => {
    try {
      const newGroup = await createGroup.execute({ groupName: groupName });
      console.log('Group created:', newGroup);
      
      // Refresh the groups list
      const updatedGroups = await getGroups.execute();
      setGroups(updatedGroups.groups || []);
      
      setShowDialog(false);
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error; // Re-throw to let the dialog handle the error
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/group/${id}`);
  };



  // Loading state
  if (isLoading) {
    return (
      <div className="tab-content">
        <h2>Group Management</h2>
        <p>Manage your expense groups and track shared expenses.</p>
        
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your groups...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (getGroups.error) {
    return (
      <div className="tab-content">
        <h2>Group Management</h2>
        <p>Manage your expense groups and track shared expenses.</p>
        
        <div className="error-container">
          <p className="error-message">Failed to load groups</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h2>Group Management</h2>
      <p>Manage your expense groups and track shared expenses.</p>
      
      <div className="group-actions">
        <Button 
          variant="primary" 
          size="large" 
          onClick={handleOpenDialog}
          disabled={createGroup.loading}
        >
          {createGroup.loading ? 'Creating...' : 'Create New Group'}
        </Button>
        <Button variant="secondary" size="large">
          Join Group
        </Button>
      </div>

      <CreateGroupDialog
        open={showDialog}
        onClose={handleCloseDialog}
        onCreate={handleCreateGroup}
        isLoading={createGroup.loading}
      />

      <div className="groups-list">
        <div className="groups-header">
          <h3>Your Groups ({groups.length})</h3>
        </div>
        
        {groups.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any groups yet.</p>
            <p>Create your first group to start managing expenses!</p>
          </div>
        ) : (
          groups.map(group => (
            <div className="group-item" key={group.groupId}>
              <div className="group-info">
                <h4>👥 {group.groupName}</h4>
                <p>
                  {group.memberCount || group.members || 0} members
                  {group.totalExpenses && ` • $${group.totalExpenses} total expenses`}
                </p>
              </div>
              <Button variant="ghost" size="small" onClick={() => handleViewDetails(group.groupId)}>
                View Details
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupTab; 