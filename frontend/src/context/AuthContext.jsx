// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Create the Context object.
// We'll export this so our Provider can use it.
const AuthContext = createContext();

// 2. Create the Provider component.
// This component will wrap our entire application and hold the authentication state.
export const AuthProvider = ({ children }) => {
  // State to hold the user information and their token.
  // We'll check local storage on initial load.
  const [user, setUser] = useState(() => {
    try {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      return userFromStorage || null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle user login.
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Make a POST request to our backend's login endpoint.
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      
      // Save the user data (including the token) to state.
      setUser(response.data);
      
      // Save the user data to local storage for persistence.
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err; // Re-throw the error so components can handle it.
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user logout.
  const logout = () => {
    // Clear the user from state and local storage.
    setUser(null);
    localStorage.removeItem('user');
  };

  // Function to handle user registration.
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Make a POST request to our backend's register endpoint.
      const response = await axios.post('http://localhost:5000/api/users/register', { name, email, password });

      // Save the new user data to state.
      setUser(response.data);
      
      // Save the user data to local storage.
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // The value object that will be provided to components wrapped by this Provider.
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to consume the context.
// This is a convenient way for any component to access our auth state.
export const useAuth = () => {
  return useContext(AuthContext);
};