// frontend/src/components/Login.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // If login is successful, navigate back to the home page.
      onNavigate('Home');
    } catch (err) {
      // The error is already handled by the context and shown below.
    }
  };

  return (
    <div className="auth-form-container">
      <p className="auth-form-title">Login to Your Bookshelf</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account?{' '}
        <a href="#" onClick={() => onNavigate('Register')}>Register here</a>
      </p>
    </div>
  );
};

export default Login;
