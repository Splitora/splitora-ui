import React, { useState } from 'react';
import { Button } from '../../../components';
import './CreateGroupDialog.css';

const CreateGroupDialog = ({ open, onClose, onCreate, isLoading = false }) => {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    setError('');
    
    try {
      await onCreate(groupName.trim());
      setGroupName('');
    } catch (error) {
      setError(error.message || 'Failed to create group');
    }
  };

  const handleClose = () => {
    setGroupName('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <h2>Create New Group</h2>
        <form onSubmit={handleSubmit} className="create-group-form">
          <label htmlFor="groupName">Group Name</label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            placeholder="Enter group name"
            autoFocus
          />
          {error && <div className="field-error">{error}</div>}
          <div className="dialog-actions">
            <Button type="button" variant="ghost" size="medium" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="medium" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupDialog; 