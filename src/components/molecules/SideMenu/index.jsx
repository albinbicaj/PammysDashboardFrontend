import React, { useEffect, useState } from 'react';
import MenuItem from '../../atoms/MenuItem';
import { dashboardItems, profileItems, fulfillmentItems } from './stories';
import { useAuthContext } from '../../../context/Auth.context';
import { RoleEnum } from '../../../enums/Role.enum';
import queryString from 'query-string';
import Collapse from '@mui/material/Collapse';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';
import { Tooltip } from '@mui/material';
import PermissionCheck from '../PermissionCheck/PermissionCheck';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';

const SidebarItemsMenu = ({ menu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = queryString.parse(location.search);
  const [isModalOpen, setIsModalOpen] = useState(queryParams.openModal === 'true');

  const { user, isUserLoading } = useAuthContext();
  const [openDashboard, setOpenDashboard] = React.useState(true);
  const [openProfile, setOpenProfile] = React.useState(true);
  const [openFulfillment, setOpenFulfillment] = React.useState(true);
  const updatedParams = { ...queryParams };
  delete updatedParams.openModal;

  const handleClickDashboard = () => {
    setOpenDashboard(!openDashboard);
  };

  const handleClickProfile = () => {
    setOpenProfile(!openProfile);
  };
  const handleClickFulfillment = () => {
    setOpenFulfillment(!openFulfillment);
  };

  // Use useEffect to update the modal state when the query parameters change
  useEffect(() => {
    setIsModalOpen(queryParams.openModal === 'true');
  }, [location.search]);

  const handleInviteClick = () => {
    // Update the query parameters and add 'openModal=true'
    const updatedParams = {
      ...queryParams,
      openModal: 'true', // Ensure the value is a string, not a boolean
    };

    // Convert the updated parameters back to a query string
    const updatedQueryString = queryString.stringify(updatedParams);

    // Update the browser's location with the new query string
    navigate(`${location.pathname}?${updatedQueryString}`);
  };

  const profilePageAccess = (userRole) => {
    return profileItems.filter((item) => item.roles.includes(userRole) && !item.disabled);
  };

  const accessibleDashboardItems = dashboardItems.filter(
    (item) => item.roles.includes(user?.role_id) && !item.disabled,
  );
  const accessibleFulfillmentItems = fulfillmentItems.filter(
    (item) => item.roles.includes(user?.role_id) && !item.disabled,
  );
  const accessibleProfileItems = profileItems.filter(
    (item) => item.roles.includes(user?.role_id) && !item.disabled,
  );

  return (
    <div className="flex flex-col gap-6 ">
      {isUserLoading ? (
        <div className={`h-[80dvh] ${menu ? 'w-64' : ''}`}>
          <PammysLoading />
        </div>
      ) : null}
      <div>
        {accessibleDashboardItems.length > 1 && (
          <Tooltip title={`${menu ? '' : 'Rücksendungen'}`} placement="right" arrow>
            <button
              onClick={handleClickDashboard}
              className="flex w-full rounded-xl px-3  py-2.5 text-sm text-gray-700  hover:bg-gray-100 hover:text-black"
            >
              <div className={`${!openDashboard ? 'rotate-0' : 'rotate-180'} duration-150`}>
                <IoIosArrowDropdownCircle size={20} />
              </div>
              <p
                className={`${menu ? 'w-52 ps-4' : 'w-0 ps-0'} overflow-hidden text-start  font-medium duration-150`}
              >
                Rücksendungen
              </p>
            </button>
          </Tooltip>
        )}

        <Collapse in={openDashboard} timeout="auto" unmountOnExit>
          <div className="space-y-2">
            {dashboardItems.map(
              (item) =>
                user &&
                user?.role_id &&
                item.disabled === false &&
                item.roles.includes(user.role_id) && (
                  <MenuItem
                    disabled={item.disabled}
                    key={item.title}
                    path={item.path}
                    icon={item.icon}
                    title={item.title}
                    menu={menu}
                  />
                ),
            )}
          </div>
        </Collapse>
      </div>

      <div>
        {accessibleFulfillmentItems.length > 1 && (
          <Tooltip title={`${menu ? '' : 'Versand'}`} placement="right" arrow>
            <button
              onClick={handleClickFulfillment}
              className="!no-decoration flex w-full items-center rounded-xl  px-3 py-2.5 text-sm  text-gray-700 hover:bg-gray-100 hover:text-black"
            >
              <div className={`${!openFulfillment ? 'rotate-0' : 'rotate-180'} duration-150`}>
                <IoIosArrowDropdownCircle size={20} />
              </div>
              <p
                className={`${menu ? 'line-clamp-2 w-52 ps-4' : 'line-clamp-1 w-0 ps-0'} overflow-hidden  text-nowrap text-start font-medium duration-150`}
              >
                Versand
              </p>
            </button>
          </Tooltip>
        )}

        <Collapse in={openFulfillment} timeout="auto" unmountOnExit>
          <div className="fulfillment-items-wrapper space-y-2">
            {fulfillmentItems.map(
              (item) =>
                user &&
                user?.role_id &&
                item.roles.includes(user.role_id) && (
                  <MenuItem
                    disabled={item.disabled}
                    key={item.title}
                    path={item.path}
                    icon={item.icon}
                    title={item.title}
                    menu={menu}
                    showCount={item?.showCount || false}
                  />
                ),
            )}
          </div>
        </Collapse>
      </div>
      <div>
        <div>
          {accessibleFulfillmentItems.length > 1 && (
            <Tooltip title={`${menu ? '' : 'Profil'}`} placement="right" arrow>
              <button
                onClick={handleClickProfile}
                className="flex w-full items-center rounded-xl px-3  py-2.5 text-sm text-gray-700  hover:bg-gray-100 hover:text-black"
              >
                <div className={`${!openProfile ? 'rotate-0' : 'rotate-180'} duration-150`}>
                  <IoIosArrowDropdownCircle size={20} />
                </div>
                <p
                  className={`${menu ? 'line-clamp-2 w-52 ps-4' : 'line-clamp-1 w-0 ps-0'} overflow-hidden  text-nowrap text-start font-medium duration-150`}
                >
                  Profil
                </p>
              </button>
            </Tooltip>
          )}

          <Collapse in={openProfile} timeout="auto" unmountOnExit>
            <div className="space-y-2">
              {profileItems.map(
                (item) =>
                  user &&
                  user?.role_id &&
                  item.roles.includes(user.role_id) && (
                    <MenuItem
                      disabled={item.disabled}
                      key={item.title}
                      path={item.path}
                      icon={item.icon}
                      title={item.title}
                      menu={menu}
                    />
                  ),
              )}
              {/* <PermissionCheck roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE]}>
                <Tooltip title={`${menu ? '' : 'Teammitglieder einladen'}`} placement="right" arrow>
                  <div
                    className="flex w-full cursor-pointer  items-center rounded-xl px-3 py-2.5 text-sm  text-gray-700 hover:bg-gray-100 hover:text-black"
                    onClick={handleInviteClick}
                  >
                    <div className="">
                      <FiUserPlus size={20} />
                    </div>
                    <p
                      className={`${menu ? 'line-clamp-2 w-52 ps-4' : 'line-clamp-1 w-0 ps-0'} overflow-hidden font-medium duration-150 `}
                    >
                      Teammitglieder einladen
                    </p>
                  </div>
                </Tooltip>
              </PermissionCheck> */}
              {/* {user?.role_id == RoleEnum.ADMIN || user?.role_id == RoleEnum.WAREHOUSE_EMPLOYEE ? (
                <Tooltip title={`${menu ? '' : 'Teammitglieder einladen'}`} placement="right" arrow>
                  <div
                    className="flex w-full cursor-pointer  items-center rounded-xl px-3 py-2.5 text-sm  text-gray-700 hover:bg-gray-100 hover:text-black"
                    onClick={handleInviteClick}
                  >
                    <div className="">
                      <FiUserPlus size={20} />
                    </div>
                    <p
                      className={`${menu ? 'line-clamp-2 w-52 ps-4' : 'line-clamp-1 w-0 ps-0'} overflow-hidden font-medium duration-150 `}
                    >
                      Teammitglieder einladen
                    </p>
                  </div>
                </Tooltip>
              ) : null} */}
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default SidebarItemsMenu;
