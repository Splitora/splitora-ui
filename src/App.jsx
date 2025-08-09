import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, HomePage, Login, Signup, EditProfile, GroupPage } from './pages';
import { useAuthState } from './hooks/useAuthState';
import { AuthProvider } from './contexts';
import { setLoginPromptTrigger } from './utils/api';
import LoginPromptModal from './components/LoginPromptModal';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';
import './styles/global.css';
import './App.css';

// Inner App component that uses the auth context
function AppContent() {
  const { showLoginPromptModal } = useAuthState();

  // Set up the login prompt trigger in the API interceptor
  useEffect(() => {
    setLoginPromptTrigger(showLoginPromptModal);
  }, [showLoginPromptModal]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={
          <AppLayout>
            <HomePage />
          </AppLayout>
        } />
        <Route path="/default" element={
          <AppLayout>
            <AuthRedirect>
              <HomePage />
            </AuthRedirect>
          </AppLayout>
        } />
        <Route path="/login" element={
          <AppLayout>
            <Login />
          </AppLayout>
        } />
        <Route path="/signup" element={
          <AppLayout>
            <Signup />
          </AppLayout>
        } />
        <Route path="/edit-profile" element={
          <AppLayout>
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          </AppLayout>
        } />
        <Route path="/:tabId" element={
          <AppLayout>
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          </AppLayout>
        } />
        <Route path="/group/:id" element={
          <AppLayout>
            <ProtectedRoute>
              <GroupPage />
            </ProtectedRoute>
          </AppLayout>
        } />
        {/* Catch-all route for invalid URLs */}
        <Route path="*" element={<Navigate to="/default" replace />} />
      </Routes>
      <LoginPromptModal />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
