import axios from 'axios';
import { jwtGetToken } from './token';
import { API_URL } from '../config/env';
import { DEVELOPMENT } from '../config/global';

console.log('API_URL', API_URL);
console.log('DEVELOPMENT', DEVELOPMENT);

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

// axios.js
const axiosInstance = axios.create({
  baseURL: API_URL, // Define your API base URL in your project's environment variables
  timeout: 2400000, // 40 Mins
  headers,
});

// Optional: You can add interceptors for handling requests and responses globally.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = jwtGetToken();

    // If a token exists, set the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // You can modify the request config here (e.g., add authentication headers)
    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response data here if needed
    return response;
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error);
  },
);

export default axiosInstance;
