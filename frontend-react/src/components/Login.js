// src/components/Login.js
import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!isLogin && !formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      let data;
      if (isLogin) {
        data = await loginUser(formData.email, formData.password);
      } else {
        data = await registerUser(formData);
      }

      if (data.error) {
        setError(data.error);
      } else {
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message || (isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.'));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <p className="error" style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label>Name: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
              placeholder="Enter your full name"
            />
          </div>
        )}
        <div>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password (min 6 characters)"
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setFormData({ email: '', password: '', name: '' });
          }}
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0 }}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
}

export default Login;
