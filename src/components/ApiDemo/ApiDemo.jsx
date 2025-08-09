import React, { useState } from 'react';
import Button from '../Button';
import { useGroups, useExpenses } from '../../hooks';
import './ApiDemo.css';

const ApiDemo = () => {
  const { getGroups, createGroup } = useGroups();
  const { getExpenses } = useExpenses();
  
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  const handleGetGroups = async () => {
    try {
      const groups = await getGroups.execute();
      console.log('Groups:', groups);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      const newGroup = await createGroup.execute({ name: newGroupName });
      console.log('Created group:', newGroup);
      setNewGroupName('');
      // Refresh groups list
      await getGroups.execute();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleGetExpenses = async () => {
    if (!selectedGroupId) return;
    
    try {
      const expenses = await getExpenses.execute(selectedGroupId);
      console.log('Expenses:', expenses);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  return (
    <div className="api-demo">
      <h2>API Integration Demo</h2>
      
      <div className="demo-section">
        <h3>Groups API</h3>
        
        <div className="demo-controls">
          <Button 
            onClick={handleGetGroups}
            disabled={getGroups.loading}
            variant="primary"
          >
            {getGroups.loading ? 'Loading...' : 'Get Groups'}
          </Button>
          
          {getGroups.error && (
            <div className="error-message">
              Error: {getGroups.error.message}
            </div>
          )}
          
          {getGroups.data && (
            <div className="data-display">
              <h4>Groups ({getGroups.data.length})</h4>
              <ul>
                {getGroups.data.map(group => (
                  <li key={group.id}>
                    {group.name}
                    <button 
                      onClick={() => setSelectedGroupId(group.id)}
                      className="select-btn"
                    >
                      Select
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="demo-controls">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter group name"
            className="demo-input"
          />
          <Button 
            onClick={handleCreateGroup}
            disabled={createGroup.loading || !newGroupName.trim()}
            variant="secondary"
          >
            {createGroup.loading ? 'Creating...' : 'Create Group'}
          </Button>
          
          {createGroup.error && (
            <div className="error-message">
              Error: {createGroup.error.message}
            </div>
          )}
        </div>
      </div>

      <div className="demo-section">
        <h3>Expenses API</h3>
        
        <div className="demo-controls">
          <Button 
            onClick={handleGetExpenses}
            disabled={getExpenses.loading || !selectedGroupId}
            variant="primary"
          >
            {getExpenses.loading ? 'Loading...' : 'Get Expenses'}
          </Button>
          
          {selectedGroupId && (
            <span className="selected-group">
              Selected Group ID: {selectedGroupId}
            </span>
          )}
          
          {getExpenses.error && (
            <div className="error-message">
              Error: {getExpenses.error.message}
            </div>
          )}
          
          {getExpenses.data && (
            <div className="data-display">
              <h4>Expenses ({getExpenses.data.length})</h4>
              <ul>
                {getExpenses.data.map(expense => (
                  <li key={expense.id}>
                    {expense.name} - ${expense.amount}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="demo-info">
        <h3>API Features Demonstrated</h3>
        <ul>
          <li>✅ Axios-based HTTP client for reliable requests</li>
          <li>✅ Loading states for all API calls</li>
          <li>✅ Error handling with user-friendly messages</li>
          <li>✅ Automatic token management via interceptors</li>
          <li>✅ Request/response interceptors for global handling</li>
          <li>✅ Request timeout handling (10 seconds)</li>
          <li>✅ Type-safe API methods</li>
          <li>✅ Easy-to-use React hooks</li>
          <li>✅ Network error detection</li>
          <li>✅ Automatic response data extraction</li>
        </ul>
      </div>
      
      <div className="demo-info">
        <h3>Response Structure Handling</h3>
        <p>The API service automatically handles the standard response structure:</p>
        <div className="code-example">
          <h4>Success Response:</h4>
          <pre>{`{
  "success": true,
  "message": "Operation successful", 
  "data": {
    "id": 1,
    "name": "Group Name"
  }
}`}</pre>
          <h4>Error Response:</h4>
          <pre>{`{
  "success": false,
  "message": "Error message",
  "error": "Detailed error info"
}`}</pre>
          <p><strong>Note:</strong> The service automatically extracts the <code>data</code> property from successful responses, so you get the actual data directly.</p>
        </div>
      </div>
    </div>
  );
};

export default ApiDemo; 