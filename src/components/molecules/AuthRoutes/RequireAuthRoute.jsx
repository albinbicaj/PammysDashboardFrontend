import React, { useContext, useMemo } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/Auth.context';
// import { RoleEnum } from '../../../enums/Role.enum';

export const RequireAuthRoute = ({ roles }) => {
  const location = useLocation();
  const { isAuthenticated, hasRole } = useContext(AuthContext);

  const authorized = useMemo(() => hasRole(roles), [hasRole, roles]);

  if (!isAuthenticated) {
    return <Navigate to="/dashboard/login" state={{ from: location }} />;
  }

  if (isAuthenticated && !authorized) {
    return <Navigate to="/dashboard" state={{ from: location }} />;
  }

  return <Outlet />;
};

// return isAuthenticated ? (
//   <Outlet />
// ) : (
//   <Navigate to="/dashboard/login" state={{ from: location }} />
// );

//
// v2?
// return isAuthenticated && authorized ? (
//   <Outlet />
// ) : isAuthenticated && !authorized ? (
//   <Navigate
//     // to={user?.role_id === RoleEnum.PACK ? '/dashboard/dispatch-center' : '/dashboard/return'}
//     to={user?.role_id !== RoleEnum.PACK ? '/dashboard/return' : '/dashboard/dispatch-center'}
//     state={{ from: location }}
//   />
// ) : (
//   <Navigate to="/dashboard/login" state={{ from: location }} />
// );
// };
