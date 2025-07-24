import React, { useContext } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/Auth.context';
// contexts

export const RequireNonAuthRoute = () => {
  // hooks
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? (
    <Navigate to={{ pathname: '/dashboard/return' }} state={{ from: location }} />
  ) : (
    <Outlet />
  );
};
