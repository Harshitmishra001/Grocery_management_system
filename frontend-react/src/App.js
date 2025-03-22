// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InventoryManager from './components/InventoryManager';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (token exists)
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Save user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <header>
          <h1>Grocery Management System</h1>
          {user && (
            <button onClick={handleLogout} className="logout-button">Logout</button>
          )}
        </header>

        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/inventory" 
            element={
              user ? <InventoryManager user={user} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/" 
            element={
              <Navigate to={user ? "/dashboard" : "/login"} />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
