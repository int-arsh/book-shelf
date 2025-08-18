// frontend/src/api.js

import axios from 'axios';

// Create a new Axios instance
const api = axios.create({
  baseURL: 'https://book-shelf-uxxo.onrender.com/api', // Replace with your Render backend URL once deployed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use an interceptor to automatically attach the token
// This code will run before every single request made by this `api` instance.
api.interceptors.request.use(config => {
  // Get the user data from local storage.
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  // If a token exists, attach it to the Authorization header.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // If no token exists, make sure the header is not present.
    delete config.headers.Authorization;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
