import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtGetToken } from '../utils/token';
import { readFromStorage, removeFromStorage } from '../utils/storage/webStorage';
import axios from '../utils/axios.js';
import { writeAuthToken } from '../utils/auth/AuthToken';
import { useNavigate } from 'react-router-dom';
import { AUTH_TOKEN_KEY } from '../config/env.js';
import showToast from '../hooks/useToast.jsx';
import axiosInstance from '../utils/axios.js';
import { RoleEnum } from '../enums/Role.enum.js';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isUserLoading: false,
  login: (token) => null,
  loginWithQRCode: () => null,
  setUser: (user) => null,
  hasRole: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};
export const AuthContextProvider = (props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!jwtGetToken());
  const [isUserLoading, setIsUserLoading] = useState(true);

  const token = jwtGetToken();
  const fetchMe = async () => {
    if (!navigator.onLine) return;
    setIsUserLoading(true);
    try {
      const response = await axios.get(`/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const userData = response.data;
        // console.log(response.data);
        // Call the checkAndUpdateIp function
        checkAndUpdateIp(userData.ip);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      removeFromStorage(AUTH_TOKEN_KEY, 'localStorage');
      // removeFromStorage('user_role', 'localStorage');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/dashboard/login');
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    const cachedRoleId = parseInt(localStorage.getItem('user_role'));

    if (!navigator.onLine) {
      if (token && cachedRoleId) {
        setIsAuthenticated(true);
        setUser({ role_id: cachedRoleId });
      }
      setIsUserLoading(false);
      return;
    }
    if (!token) {
      setIsUserLoading(false);
      return;
    }
    fetchMe();
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      showToast('Du bist wieder online.', 'success');
      if (token) fetchMe();
    };

    const handleOffline = () => {
      showToast(
        'Du bist offline. Einige Funktionen sind möglicherweise nicht verfügbar.',
        'failure',
      );
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const logout = async () => {
    const redirectEmailLogin = [RoleEnum.SUPPORT, RoleEnum.ADMIN];
    const userLocalRoleId = parseInt(readFromStorage('user_role')) || 0;

    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
      showToast('Error during logout', 'failure');
    } finally {
      removeFromStorage(AUTH_TOKEN_KEY, 'localStorage');
      setUser(null);
      setIsAuthenticated(false);
      if (redirectEmailLogin.includes(userLocalRoleId)) {
        navigate('/dashboard/login');
      } else {
        navigate('/dashboard/login-warehouse');
      }
    }
  };

  const hasRole = (roles) => {
    if (!roles || roles.length === 0) return false; // No roles provided to check
    const roleId = user?.role_id || parseInt(localStorage.getItem('user_role'));
    return roles.includes(roleId);
  };

  // const hasRole = (roles) => {
  //   let authorized = false;
  //   const role = parseInt(localStorage.getItem('user_role'));
  //   if (role) {
  //     authorized = roles.includes(role);
  //   } else {
  //     authorized = roles.includes(role || user?.role_id);
  //   }
  //   return authorized;
  // };

  const login = async (email, password, roleId = 0) => {
    try {
      const response = await axios.post(`/auth/login`, {
        email: email,
        password: password,
        role_id: roleId,
      });
      writeAuthToken(response.data.token);
      localStorage.setItem('user_role', response.data.role);
      setIsAuthenticated(true);
      const meResponse = await axios.get('/me');
      const userData = meResponse.data;
      setUser(userData);
    } catch (error) {
      showToast(error.response?.data?.message || 'Something went wrong.', 'failure');
    }
  };
  // Check and update IP
  const checkAndUpdateIp = async (userIp) => {
    if (!userIp) return; // If the user IP is null, do nothing

    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const currentIp = ipData.ip;

      if (userIp !== currentIp) {
        // User IP differs from the current IP

        const backendResponse = await axiosInstance.post('/auth/change-password', {
          ip: currentIp,
        });

        if (backendResponse.status === 200) {
          showToast(`IP updated successfully to ${currentIp}`, 'success');
          fetchMe();
        } else {
          showToast('Failed to update IP', 'failure');
        }
      }
    } catch (error) {
      showToast('Error while checking/updating IP', 'failure');
    }
  };
  // const loginWithQRCode = async (token) => {
  //   try {
  //     const response = await axios.post(`/auth/qr-code-login`, {
  //       t: token,
  //     });
  //     writeAuthToken(response.data.token);
  //     localStorage.setItem('user_role', response.data.role);
  //     setIsAuthenticated(true);
  //     const meResponse = await axios.get('/me');
  //     const userData = meResponse.data;
  //     setUser(userData);
  //   } catch (error) {
  //     showToast(error.response?.data?.message || 'Something went wrong.', 'failure');
  //   }
  // };
  const loginWithQRCode = (token, roleId = 0) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(`/auth/qr-code-login`, { t: token, role_id: roleId });
        writeAuthToken(response.data.token);
        localStorage.setItem('user_role', response.data.role);
        setIsAuthenticated(true);
        const meResponse = await axios.get('/me');
        const userData = meResponse.data;
        setUser(userData);
        resolve('Login successful!');
      } catch (error) {
        console.error('Login error:', error);
        reject(error.response?.data?.message || 'Something went wrong.');
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isUserLoading,
        login,
        loginWithQRCode,
        logout,
        error,
        hasRole,
        fetchMe,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
