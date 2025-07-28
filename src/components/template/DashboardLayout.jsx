import React, { useEffect, useState } from 'react';
import SideBar from '../organisms/Sidebar';
import { UserModal } from '../organisms';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { useAuthContext } from '../../context/Auth.context';
import { HeaderV2 } from '../organisms/Header/HeaderV2';
import './DashboardLayout.css';
import { ENVIRONMENT } from '../../config/env';
import { checkLocalMenuState } from '../../utils/checkLocalMenuState';
import { RoleEnum } from '../../enums/Role.enum';
import { useVersionChecker } from '../../hooks/useVersionChecker';
import { UpdateBanner } from '../atoms/UpdateBanner/UpdateBanner';

export const DashboardLayout = ({ children }) => {
  const { user } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = queryString.parse(location.search);
  const [isModalOpen, setIsModalOpen] = useState(queryParams.openModal === 'true');

  const [menu, setMenu] = useState(checkLocalMenuState());

  const toggleMenu = () => {
    localStorage.setItem('menu', JSON.stringify(!menu));
    setMenu(!menu);
  };

  // Use useEffect to update the modal state when the query parameters change
  useEffect(() => {
    setIsModalOpen(queryParams.openModal === 'true');
  }, [location.search]);

  // Function to close the modal and remove 'openModal' from query parameters
  const handleCloseModal = () => {
    const updatedParams = { ...queryParams };
    delete updatedParams.openModal;

    // Convert the updated parameters back to a query string
    const updatedQueryString = queryString.stringify(updatedParams);

    // Update the browser's location with the new query string
    navigate(`${location.pathname}?${updatedQueryString}`);

    // Close the modal
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className={`flex h-screen ${ENVIRONMENT === 'production' ? 'pt-16' : 'pt-20'}`}>
        <div className={`h-full overflow-y-auto overflow-x-hidden bg-white duration-150 `}>
          <SideBar menu={menu} toggleMenu={toggleMenu} />
        </div>
        <main className="h-100 relative flex-1 overflow-auto border-l border-t p-4 outline-none">
          {children}
        </main>

        {(user?.role_id === RoleEnum.ADMIN ||
          user?.role_id === RoleEnum.WAREHOUSE_EMPLOYEE ||
          user?.role_id === RoleEnum.IEM ||
          user?.role_id === RoleEnum.LAGERLEITER) && (
          <UserModal open={isModalOpen} handleClose={handleCloseModal} />
        )}
      </div>
      <HeaderV2 menu={menu} toggleMenu={toggleMenu} />
      <UpdateBanner />
    </div>
  );
};
