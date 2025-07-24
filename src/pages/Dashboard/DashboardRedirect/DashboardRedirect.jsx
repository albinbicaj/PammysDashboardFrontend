import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/Auth.context';
import { RoleEnum } from '../../../enums/Role.enum';

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      switch (user.role_id) {
        case RoleEnum.PACK:
          RoleEnum;
          navigate('/dashboard/dispatch-center');
          break;
        case RoleEnum.PICK:
          RoleEnum;
          navigate('/dashboard/picker');
          break;
        case RoleEnum.RETOURE:
          navigate('/dashboard/return');
          break;
        case RoleEnum.IEM:
          navigate('/dashboard/products');
          break;
        // Add more cases as needed for different roles
        default:
          navigate('/dashboard/return'); // Default redirection if no role matches
          break;
      }
    }
  }, [user, navigate]);

  return <div>Redirecting...</div>;
};

export default DashboardRedirect;
