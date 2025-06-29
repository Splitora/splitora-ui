import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login, Signup, EditProfile } from './pages';
import './styles/global.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Navigate to="/group" replace />} />
          <Route path="/:tabId" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
