import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../../context/Auth.context';
import { Button } from '@mui/material';
import Popover from '@mui/material/Popover';
import { Searchbar } from '../../atoms';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import queryString from 'query-string';
export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const { user, logout } = useAuthContext();
  const [orderNumber, setOrderNumber] = useState(parsed.return_id || '');
  const handleLogout = () => {
    logout();
    navigate('/dashboard/login');
  };
  const handleRedirection = () => {
    navigate('/dashboard/profile');
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNameClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const updateOrderNumber = (newOrderNumber) => {
    setOrderNumber(newOrderNumber);
    if (newOrderNumber.length === 10) {
      navigate(`/dashboard/order?return_id=${newOrderNumber}`, {
        replace: true,
      });
    }
  };

  return (
    <nav className="h-20  flex items-center text-center justify-between  px-6 bg-white  border-b w-full">
      <div className="w-3/5 flex items-center">
        <Searchbar updateOrderNumber={updateOrderNumber} currentOrderNumber={orderNumber} />
      </div>
      <div>
        <a
          href="#"
          className="flex flex-col items-left text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2 "
          onClick={handleNameClick}
        >
          <span className="font-semibold  leading-5 text-right text-gray-800 ">
            {user?.first_name} {user?.last_name}
          </span>
          <span className="font-normal  text-xs leading-5 text-right text-gray-600 ">
            {user?.email}
          </span>
        </a>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <List>
            <ListItem>
              <Button onClick={handleRedirection} variant="outlined">
                <SettingsIcon className="ml-3" />
                Settings
              </Button>
            </ListItem>
            <ListItem>
              <Button
                className="flex items-center justify-around"
                onClick={handleLogout}
                variant="outlined"
              >
                <LogoutIcon className="ml-3" />
                Log Out
              </Button>
            </ListItem>
          </List>
        </Popover>
      </div>
    </nav>
  );
};
