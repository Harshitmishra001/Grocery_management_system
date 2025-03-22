// src/App.js
import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  // A simple handler after successful login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Render the Login component if no user, otherwise show Dashboard
  return (
    <div>
      <h1>Welcome to SmartNest</h1>
      {user ? (
        <Dashboard user={user} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
