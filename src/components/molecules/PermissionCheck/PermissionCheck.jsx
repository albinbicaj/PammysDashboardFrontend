import React, { useMemo } from 'react';
import { useAuthContext } from '../../../context/Auth.context';

const PermissionCheck = ({ roles = [1], children }) => {
  const { user } = useAuthContext(); // Assuming `user` contains the current user's roles/permissions
  // console.log('USER');
  // console.log(user);
  // Use memoization to avoid recalculating the permission check on every render
  const hasPermission = useMemo(() => {
    if (!user || !user.role_id) return false;

    // Check if the user has at least one of the required roles

    return roles.includes(user.role_id);
  }, [user, roles]);

  // Render the children if permission is granted, otherwise render null
  return hasPermission ? children : null;
};

export default PermissionCheck;
