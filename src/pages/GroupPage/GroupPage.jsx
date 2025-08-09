import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useGroups, useExpenses, useSettlements } from '../../hooks';
import './GroupPage.css';

// Default banner image
const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

// ContextMenu component
const ContextMenu = ({ x, y, options, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <ul
      className="context-menu"
      ref={menuRef}
      style={{ top: y, left: x, position: 'fixed', zIndex: 1000 }}
    >
      {options.map((opt, idx) => (
        <li key={idx} className="context-menu-item" onClick={opt.onClick}>
          {opt.label}
        </li>
      ))}
    </ul>
  );
};

const GroupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // API hooks
  const { getGroup, deleteGroup, addMembers } = useGroups();
  const { getExpenses, createExpense, addDebtors, deleteExpense } = useExpenses();
  const { getSettlements } = useSettlements();
  
  // Component state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [showAddMembersDialog, setShowAddMembersDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data state
  const [groupData, setGroupData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  
  // Error state for each section
  const [groupError, setGroupError] = useState(null);
  const [expensesError, setExpensesError] = useState(null);
  const [settlementsError, setSettlementsError] = useState(null);
  
  // Expense delete loading state
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  
  // Form state
  const [expenseForm, setExpenseForm] = useState({
    name: '',
    amount: '',
    creditor: '',
    debtors: []
  });
  const [expenseErrors, setExpenseErrors] = useState({});
  const [expenseWarning, setExpenseWarning] = useState('');
  
  // Add Member form state
  const [addMemberForm, setAddMemberForm] = useState({
    method: 'email', // 'email', 'phone', 'contacts'
    email: '',
    phone: '',
    countryCode: '+1',
    name: '',
    selectedContact: null
  });
  const [addMembersErrors, setAddMembersErrors] = useState({});
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: '', // 'expense', 'member', 'settlement'
    item: null
  });

  // Selection state
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedSettlements, setSelectedSettlements] = useState([]);

  // Context menu handlers
  const handleContextMenu = (e, type, item) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type,
      item
    });
  };

  const closeContextMenu = () => setContextMenu(prev => ({ ...prev, visible: false }));

  // Action stubs
  const handleEdit = () => {
    alert(`Edit ${contextMenu.type}: ${JSON.stringify(contextMenu.item)}`);
    closeContextMenu();
  };
  const handleDelete = () => {
    if (contextMenu.type === 'expense') {
      handleDeleteExpense(contextMenu.item.expenseId);
    } else if (contextMenu.type === 'member') {
      alert('Delete member: ' + JSON.stringify(contextMenu.item));
    } else if (contextMenu.type === 'settlement') {
      alert('Delete settlement: ' + JSON.stringify(contextMenu.item));
    }
    closeContextMenu();
  };
  const handleSelect = () => {
    if (contextMenu.type === 'expense') {
      setSelectedExpenses(prev => prev.includes(contextMenu.item.expenseId)
        ? prev.filter(id => id !== contextMenu.item.expenseId)
        : [...prev, contextMenu.item.expenseId]);
    } else if (contextMenu.type === 'member') {
      setSelectedMembers(prev => prev.includes(contextMenu.item.groupMemberId)
        ? prev.filter(id => id !== contextMenu.item.groupMemberId)
        : [...prev, contextMenu.item.groupMemberId]);
    } else if (contextMenu.type === 'settlement') {
      setSelectedSettlements(prev => prev.some(sel => sel.creditorId === contextMenu.item.creditorId && sel.debtorId === contextMenu.item.debtorId)
        ? prev.filter(sel => !(sel.creditorId === contextMenu.item.creditorId && sel.debtorId === contextMenu.item.debtorId))
        : [...prev, { creditorId: contextMenu.item.creditorId, debtorId: contextMenu.item.debtorId }]);
    }
    closeContextMenu();
  };
  
  // Fetch group data on component mount
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setIsLoading(true);
        setGroupError(null);
        setExpensesError(null);
        setSettlementsError(null);
        
        console.log('🔄 Fetching group data for ID:', id);
        
        // Fetch group details
        try {
          const group = await getGroup.execute(id);
          console.log('✅ Group data fetched:', group);
          setGroupData(group);
        } catch (error) {
          console.error('❌ Failed to fetch group data:', error);
          setGroupError(error.message || 'Failed to load group information');
        }
        
        // Fetch expenses
        try {
          const expensesData = await getExpenses.execute(id);
          console.log('✅ Expenses fetched:', expensesData);
          setExpenses(expensesData || []);
        } catch (error) {
          console.error('❌ Failed to fetch expenses:', error);
          setExpensesError(error.message || 'Failed to load expenses');
        }
        
        // Fetch settlements
        try {
          const settlementsData = await getSettlements.execute(id);
          console.log('✅ Settlements fetched:', settlementsData);
          setSettlements(settlementsData.transactions || []);
        } catch (error) {
          console.error('❌ Failed to fetch settlements:', error);
          setSettlementsError(error.message || 'Failed to load settlements');
        }
        
      } catch (error) {
        console.error('❌ Unexpected error:', error);
        setGroupError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchGroupData();
    }
  }, [id]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="group-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading group information...</p>
        </div>
      </div>
    );
  }
  
  // Error state - only show full page error if group data is completely unavailable
  if (groupError && !groupData) {
    return (
      <div className="group-page">
        <div className="error-container">
          <p className="error-message">{groupError}</p>
          <Button 
            variant="secondary" 
            size="medium"
            onClick={() => navigate('/group')}
          >
            Back to Groups
          </Button>
        </div>
      </div>
    );
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteGroup.execute(id);
      console.log('Group deleted successfully');
      
      // Navigate back to groups list
      navigate('/group');
      
    } catch (error) {
      console.error('Failed to delete group:', error);
      // TODO: Show error message to user
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleAddExpenseClick = () => {
    setShowAddExpenseDialog(true);
  };

  const handleAddExpenseCancel = () => {
    setShowAddExpenseDialog(false);
    setExpenseForm({ name: '', amount: '', creditor: '', debtors: [] });
    setExpenseErrors({});
    setExpenseWarning('');
  };

  const handleExpenseFormChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (expenseErrors[name]) {
      setExpenseErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear submit error when user starts typing
    if (expenseErrors.submit) {
      setExpenseErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  };

  const handleDebtorToggle = (memberId) => {
    setExpenseForm(prev => ({
      ...prev,
      debtors: prev.debtors.includes(memberId)
        ? prev.debtors.filter(id => id !== memberId)
        : [...prev.debtors, memberId]
    }));
  };

  const validateExpenseForm = () => {
    const errors = {};
    
    if (!expenseForm.name.trim()) {
      errors.name = 'Expense name is required';
    }
    
    if (!expenseForm.amount || parseFloat(expenseForm.amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    }
    
    if (!expenseForm.creditor) {
      errors.creditor = 'Please select who paid for this expense';
    }
    
    if (expenseForm.debtors.length === 0) {
      errors.debtors = 'Please select at least one person who owes money';
    }

    setExpenseErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddExpenseSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateExpenseForm()) {
      return;
    }

    try {
      // Step 1: Create the expense without debtors
      const expenseData = {
        description: expenseForm.name,
        amount: parseFloat(expenseForm.amount),
        payerId: expenseForm.creditor
        // Note: debtorIds removed as they will be added separately
      };
      
      const newExpense = await createExpense.execute(id, expenseData);
      console.log('Expense created:', newExpense);
      
      // Step 2: Add debtors to the expense if any are selected
      if (expenseForm.debtors.length > 0) {
        try {
          const debtorsData = {
            membersId: expenseForm.debtors
          };
          await addDebtors.execute(newExpense.expenseId, debtorsData);
          console.log('Debtors added to expense:', debtorsData);
        } catch (debtorError) {
          console.error('Failed to add debtors to expense:', debtorError);
          setExpenseWarning('Expense created successfully, but failed to add debtors. You may need to add them manually.');
        }
      }
      
      // Refresh expenses list
      const updatedExpenses = await getExpenses.execute(id);
      setExpenses(updatedExpenses || []);
      
      // Refresh settlements
      const updatedSettlements = await getSettlements.execute(id);
      setSettlements(updatedSettlements.transactions || []);
      
      // Reset form and close dialog
      setExpenseForm({ name: '', amount: '', creditor: '', debtors: [] });
      setShowAddExpenseDialog(false);
      
    } catch (error) {
      console.error('Failed to add expense:', error);
      setExpenseErrors({ submit: error.message || 'Failed to add expense. Please try again.' });
    }
  };

  const handleAddMembersClick = () => {
    setShowAddMembersDialog(true);
  };

  const handleAddMembersCancel = () => {
    setShowAddMembersDialog(false);
    setAddMemberForm({
      method: 'email',
      email: '',
      phone: '',
      countryCode: '+1',
      name: '',
      selectedContact: null
    });
    setAddMembersErrors({});
  };

  const handleAddMemberFormChange = (e) => {
    const { name, value } = e.target;
    setAddMemberForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (addMembersErrors[name]) {
      setAddMembersErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear submit error when user starts typing
    if (addMembersErrors.submit) {
      setAddMembersErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  };

  const handleMethodChange = (method) => {
    setAddMemberForm(prev => ({
      ...prev,
      method,
      email: '',
      phone: '',
      name: '',
      selectedContact: null
    }));
    setAddMembersErrors({});
  };

  const validateAddMemberForm = () => {
    const errors = {};
    
    if (!addMemberForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (addMemberForm.method === 'email') {
      if (!addMemberForm.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addMemberForm.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    if (addMemberForm.method === 'phone') {
      if (!addMemberForm.phone.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!/^\d{10,15}$/.test(addMemberForm.phone.replace(/\D/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
      }
    }
    
    if (addMemberForm.method === 'contacts') {
      if (!addMemberForm.selectedContact) {
        errors.contacts = 'Please select a contact';
      }
    }

    setAddMembersErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAddMemberForm()) {
      return;
    }

    try {
      let memberData;
      
      if (addMemberForm.method === 'email') {
        // For email method, send and name
        memberData = {
          email: addMemberForm.email,
          name: addMemberForm.name
        };
      } else if (addMemberForm.method === 'phone') {
        // For phone method, send name and phone object
        memberData = {
          name: addMemberForm.name,
          phone: {
            countryCode: addMemberForm.countryCode,
            phoneNumber: parseInt(addMemberForm.phone.replace(/\D/g, ''))
          }
        };
      } else {
        // For contacts method, use the selected contact details
        memberData = {
          name: addMemberForm.name,
          phone: {
            countryCode: addMemberForm.countryCode,
            phoneNumber: parseInt(addMemberForm.phone.replace(/\D/g, ''))
          }
        };
      }
      
      const newMember = await addMembers.execute(id, memberData);
      console.log('Member added:', newMember);
      
      // Refresh group data to get updated members
      const updatedGroup = await getGroup.execute(id);
      setGroupData(updatedGroup);
      
      // Reset form and close dialog
      setAddMemberForm({
        method: 'email',
        email: '',
        phone: '',
        countryCode: '+1',
        name: '',
        selectedContact: null
      });
      setShowAddMembersDialog(false);
      
    } catch (error) {
      console.error('Failed to add member:', error);
      setAddMembersErrors({ submit: error.message || 'Failed to add member. Please try again.' });
    }
  };

  const handleContactSelect = (contactId) => {
    setAddMemberForm(prev => ({
      ...prev,
      selectedContact: contactId
    }));
  };

  // Dummy contacts data for demonstration
  const dummyContacts = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1234567890' },
    { id: 2, name: 'Bob Wilson', email: 'bob@example.com', phone: '+1234567891' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', phone: '+1234567892' },
    { id: 4, name: 'David Miller', email: 'david@example.com', phone: '+1234567893' }
  ];

  // Expense delete handler
  const handleDeleteExpense = async (expenseId) => {
    console.log('Deleting expense:', expenseId);
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setDeletingExpenseId(expenseId);
    try {
      await deleteExpense.execute(expenseId);
      // Refresh expenses and settlements
      const updatedExpenses = await getExpenses.execute(id);
      setExpenses(updatedExpenses || []);
      const updatedSettlements = await getSettlements.execute(id);
      setSettlements(updatedSettlements.transactions || []);
    } catch (error) {
      alert(error.message || 'Failed to delete expense');
    } finally {
      setDeletingExpenseId(null);
    }
  };

  // Selection handlers
  const isSelected = (type, item) => {
    if (type === 'expense') return selectedExpenses.includes(item.expenseId);
    if (type === 'member') return selectedMembers.includes(item.groupMemberId);
    if (type === 'settlement') return selectedSettlements.some(sel => sel.creditorId === item.creditorId && sel.debtorId === item.debtorId);
    return false;
  };

  const clearSelections = () => {
    setSelectedExpenses([]);
    setSelectedMembers([]);
    setSelectedSettlements([]);
  };

  return (
    <div className="group-page">
      <div className="group-banner" style={{ backgroundImage: `url(${groupData.banner || DEFAULT_BANNER})` }} />
      <div className="group-content">
        <div className="group-header">
          <h1 className="group-name">{groupData.groupName}</h1>
          <Button 
            variant="ghost" 
            size="small" 
            onClick={handleDeleteClick}
            className="delete-group-btn"
            disabled={deleteGroup.loading}
          >
            {deleteGroup.loading ? 'Deleting...' : '🗑️ Delete Group'}
          </Button>
        </div>
        
        <div className="selection-toolbar">
          {(selectedExpenses.length > 0 || selectedMembers.length > 0 || selectedSettlements.length > 0) && (
            <div className="selection-info">
              <span>
                Selected: {selectedExpenses.length} expense(s), {selectedMembers.length} member(s), {selectedSettlements.length} settlement(s)
              </span>
              <Button variant="ghost" size="small" onClick={clearSelections}>Clear Selection</Button>
            </div>
          )}
        </div>

        <div className="group-members">
          <div className="members-header">
            <h3>Members ({groupData.groupMembers?.length || 0})</h3>
            <Button 
              variant="primary" 
              size="small" 
              onClick={handleAddMembersClick}
              className="add-members-btn"
              disabled={addMembers.loading}
            >
              {addMembers.loading ? 'Adding...' : '👥 Add Member'}
            </Button>
          </div>
          <ul>
            {groupData.groupMembers?.map(member => (
              <li
                key={member.groupMemberId}
                className={`member-item${isSelected('member', member) ? ' selected' : ''}`}
                onContextMenu={e => handleContextMenu(e, 'member', member)}
              >
                {member.name || member.email}
              </li>
            )) || []}
          </ul>
        </div>
        
        <div className="group-expenses">
          <div className="expenses-header">
            <h3>Expenses ({expenses.length})</h3>
            <Button 
              variant="primary" 
              size="small" 
              onClick={handleAddExpenseClick}
              className="add-expense-btn"
              disabled={createExpense.loading}
            >
              {createExpense.loading ? 'Adding...' : '➕ Add Expense'}
            </Button>
          </div>
          
          {expensesError ? (
            <div className="section-error">
              <p className="error-message">⚠️ {expensesError}</p>
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => {
                  setExpensesError(null);
                  // Retry fetching expenses
                  getExpenses.execute(id).then(data => setExpenses(data || [])).catch(error => {
                    setExpensesError(error.message || 'Failed to load expenses');
                  });
                }}
              >
                Retry
              </Button>
            </div>
          ) : (
            <ul>
              {expenses.map(expense => (
                <li
                  key={expense.expenseId}
                  className={`expense-item${isSelected('expense', expense) ? ' selected' : ''}`}
                  onContextMenu={e => handleContextMenu(e, 'expense', expense)}
                >
                  <div className="expense-info">
                    <span className="expense-name">{expense.description}</span>
                    <span className="expense-creditor">Paid by: {expense.payerName || expense.payerId}</span>
                  </div>
                  <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="small"
                    className="delete-expense-btn"
                    onClick={() => handleDeleteExpense(expense.expenseId)}
                    disabled={deletingExpenseId === expense.expenseId}
                  >
                    {deletingExpenseId === expense.expenseId ? 'Deleting...' : '🗑️'}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="group-settlements">
          <h3>Settlements Required ({settlements.length})</h3>
          <p className="settlements-description">
            These are the payments needed to settle all expenses in the group.
          </p>
          
          {settlementsError ? (
            <div className="section-error">
              <p className="error-message">⚠️ {settlementsError}</p>
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => {
                  setSettlementsError(null);
                  // Retry fetching settlements
                  getSettlements.execute(id).then(data => setSettlements(data.transactions || [])).catch(error => {
                    setSettlementsError(error.message || 'Failed to load settlements');
                  });
                }}
              >
                Retry
              </Button>
            </div>
          ) : (
            <ul>
              {settlements.map(settlement => (
                <li
                  key={settlement.creditorId + settlement.debtorId}
                  className={`settlement-item${isSelected('settlement', settlement) ? ' selected' : ''}`}
                  onContextMenu={e => handleContextMenu(e, 'settlement', settlement)}
                >
                  <div className="settlement-flow">
                    <div className="payment-direction">
                    <span className="creditor">{settlement.creditorName || settlement.creditor}</span>
                      <span className="arrow">→</span> 
                      <span className="debtor">{settlement.debtorName || settlement.debtor}</span>
                    </div>
                    <span className="amount">${settlement.amount.toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="modal-backdrop" onClick={handleDeleteCancel}>
          <div className="modal-dialog delete-dialog" onClick={e => e.stopPropagation()}>
            <h2>Delete Group</h2>
            <p>Are you sure you want to delete "{groupData.groupName}"? This action cannot be undone.</p>
            <p className="delete-warning">
              ⚠️ This will permanently delete the group and all associated expenses.
            </p>
            <div className="dialog-actions">
              <Button 
                type="button" 
                variant="ghost" 
                size="medium" 
                onClick={handleDeleteCancel}
                disabled={deleteGroup.loading}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="medium" 
                onClick={handleDeleteConfirm}
                disabled={deleteGroup.loading}
                className="delete-confirm-btn"
              >
                {deleteGroup.loading ? 'Deleting...' : 'Delete Group'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Dialog */}
      {showAddExpenseDialog && (
        <div className="modal-backdrop" onClick={handleAddExpenseCancel}>
                  <div className="modal-dialog add-expense-dialog" onClick={e => e.stopPropagation()}>
          <h2>Add New Expense</h2>
          {expenseWarning && (
            <div className="warning-message">
              ⚠️ {expenseWarning}
            </div>
          )}
          {expenseErrors.submit && (
            <div className="error-message">
              ❌ {expenseErrors.submit}
            </div>
          )}
          <form onSubmit={handleAddExpenseSubmit} className="add-expense-form">
              <div className="form-group">
                <label htmlFor="expenseName">Expense Description</label>
                <input
                  type="text"
                  id="expenseName"
                  name="name"
                  value={expenseForm.name}
                  onChange={handleExpenseFormChange}
                  placeholder="e.g., Groceries, Dinner, Gas"
                  className={expenseErrors.name ? 'error' : ''}
                />
                {expenseErrors.name && <span className="field-error">{expenseErrors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="expenseAmount">Amount ($)</label>
                <input
                  type="number"
                  id="expenseAmount"
                  name="amount"
                  value={expenseForm.amount}
                  onChange={handleExpenseFormChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={expenseErrors.amount ? 'error' : ''}
                />
                {expenseErrors.amount && <span className="field-error">{expenseErrors.amount}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="creditor">Paid By (Creditor)</label>
                <select
                  id="creditor"
                  name="creditor"
                  value={expenseForm.creditor}
                  onChange={handleExpenseFormChange}
                  className={expenseErrors.creditor ? 'error' : ''}
                >
                  <option value="">Select who paid</option>
                  {groupData.groupMembers?.map(member => (
                    <option key={member.groupMemberId} value={member.groupMemberId}>
                      {member.name || member.email}
                    </option>
                  )) || []}
                </select>
                {expenseErrors.creditor && <span className="field-error">{expenseErrors.creditor}</span>}
              </div>

              <div className="form-group">
                <label>Split Between (Debtors)</label>
                <div className="debtors-list">
                  {groupData.groupMembers?.map(member => (
                    <label key={member.id} className="debtor-checkbox">
                      <input
                        type="checkbox"
                        checked={expenseForm.debtors.includes(member.groupMemberId)}
                        onChange={() => handleDebtorToggle(member.groupMemberId)}
                      />
                      <span className="checkmark"></span>
                      {member.name || member.email}
                    </label>
                  )) || []}
                </div>
                {expenseErrors.debtors && <span className="field-error">{expenseErrors.debtors}</span>}
              </div>

              <div className="dialog-actions">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="medium" 
                  onClick={handleAddExpenseCancel}
                  disabled={createExpense.loading || addDebtors.loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="medium"
                  disabled={createExpense.loading || addDebtors.loading}
                >
                  {createExpense.loading || addDebtors.loading ? 'Adding...' : 'Add Expense'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Members Dialog */}
      {showAddMembersDialog && (
        <div className="modal-backdrop" onClick={handleAddMembersCancel}>
          <div className="modal-dialog add-members-dialog" onClick={e => e.stopPropagation()}>
            <h2>Add Member to Group</h2>
            <p className="dialog-description">
              Choose how you'd like to add a new member to "{groupData.groupName}".
            </p>
            
            <div className="method-selector">
              <button
                type="button"
                className={`method-option ${addMemberForm.method === 'email' ? 'active' : ''}`}
                onClick={() => handleMethodChange('email')}
              >
                📧 Add via Email
              </button>
              <button
                type="button"
                className={`method-option ${addMemberForm.method === 'phone' ? 'active' : ''}`}
                onClick={() => handleMethodChange('phone')}
              >
                📱 Add via Phone
              </button>
              <button
                type="button"
                className={`method-option ${addMemberForm.method === 'contacts' ? 'active' : ''}`}
                onClick={() => handleMethodChange('contacts')}
              >
                👥 Find in Contacts
              </button>
            </div>

            {addMembersErrors.submit && (
              <div className="error-message">
                ❌ {addMembersErrors.submit}
              </div>
            )}
            <form onSubmit={handleAddMemberSubmit} className="add-members-form">
              <div className="form-group">
                <label htmlFor="memberName">Name</label>
                <input
                  type="text"
                  id="memberName"
                  name="name"
                  value={addMemberForm.name}
                  onChange={handleAddMemberFormChange}
                  placeholder="Enter the person's name"
                  className={addMembersErrors.name ? 'error' : ''}
                />
                {addMembersErrors.name && <span className="field-error">{addMembersErrors.name}</span>}
              </div>

              {addMemberForm.method === 'email' && (
                <div className="form-group">
                  <label htmlFor="memberEmail">Email Address</label>
                  <input
                    type="email"
                    id="memberEmail"
                    name="email"
                    value={addMemberForm.email}
                    onChange={handleAddMemberFormChange}
                    placeholder="Enter email address"
                    className={addMembersErrors.email ? 'error' : ''}
                  />
                  {addMembersErrors.email && <span className="field-error">{addMembersErrors.email}</span>}
                </div>
              )}

              {addMemberForm.method === 'phone' && (
                <div className="form-group phone-group">
                  <label htmlFor="memberPhone">Phone Number</label>
                  <div className="phone-input-group">
                    <select
                      name="countryCode"
                      value={addMemberForm.countryCode}
                      onChange={handleAddMemberFormChange}
                      className="country-code-select"
                    >
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+7">🇷🇺 +7</option>
                      <option value="+55">🇧🇷 +55</option>
                    </select>
                    <input
                      type="tel"
                      id="memberPhone"
                      name="phone"
                      value={addMemberForm.phone}
                      onChange={handleAddMemberFormChange}
                      placeholder="Enter phone number"
                      className={addMembersErrors.phone ? 'error' : ''}
                    />
                  </div>
                  {addMembersErrors.phone && <span className="field-error">{addMembersErrors.phone}</span>}
                </div>
              )}

              {addMemberForm.method === 'contacts' && (
                <div className="form-group">
                  <label>Select from Contacts</label>
                  <div className="contacts-list">
                    {dummyContacts.map(contact => (
                      <label key={contact.id} className="contact-radio">
                        <input
                          type="radio"
                          name="selectedContact"
                          value={contact.id}
                          checked={addMemberForm.selectedContact === contact.id}
                          onChange={() => handleContactSelect(contact.id)}
                        />
                        <span className="checkmark"></span>
                        <div className="contact-info">
                          <span className="contact-name">{contact.name}</span>
                          <span className="contact-details">
                            {contact.email} • {contact.phone}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {addMembersErrors.contacts && <span className="field-error">{addMembersErrors.contacts}</span>}
                </div>
              )}

              <div className="dialog-actions">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="medium" 
                  onClick={handleAddMembersCancel}
                  disabled={addMembers.loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="medium"
                  disabled={addMembers.loading}
                >
                  {addMembers.loading ? 'Adding...' : 'Add Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={[
            { label: 'Edit', onClick: handleEdit },
            { label: 'Delete', onClick: handleDelete },
            { label: 'Select', onClick: handleSelect }
          ]}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default GroupPage; 