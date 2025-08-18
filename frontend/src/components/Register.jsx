// frontend/src/components/Register.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Register = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      // If registration is successful, navigate back to the home page.
      onNavigate('Home');
    } catch (err) {
      // The error is already handled by the context and shown below.
    }
  };

  return (
    <div className="auth-form-container">
      <p className="auth-form-title">Create an Account</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <a href="#" onClick={() => onNavigate('Login')}>Login here</a>
      </p>
    </div>
  );
};

export default Register;
