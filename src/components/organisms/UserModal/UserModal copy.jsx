import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { AddUserIcon, UserDetails } from '../../atoms';
import { users } from '../../../data/users';
import axiosInstance from '../../../utils/axios';
import { CustomSnackBar } from '../../molecules';
import { FiUserPlus } from 'react-icons/fi';
export const UserModalCopy = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [snackBar, setSnackBar] = useState(false);
  const [snackBarMessage, setSnackbarMessage] = useState('');
  const [snackBarSeverity, setSnackbarSeverity] = useState('');

  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Adding new user');
      // Assuming your endpoint is /register, change it if necessary
      const response = await axiosInstance.post('/auth/register', userData);

      setLoading(false);
      setLoadingMessage('');
      setSnackBar(true); // Show the success Snackbar
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity(response.data.severity);
      setUserData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role_id: '',
      });
      setTimeout(() => {
        setSnackBar(false);
        setSnackbarMessage('');
        setSnackbarSeverity('');
      }, 3000);
    } catch (error) {
      setLoading(false);
      setLoadingMessage('');
      setSnackBar(true); // Show the success Snackbar
      const errorMessages = Object.keys(error.response.data.errors).map(
        (field) => error.response.data.errors[field][0],
      );
      setSnackbarMessage(errorMessages);
      setSnackbarSeverity('error');
      setTimeout(() => {
        setSnackBar(false);
        setSnackbarMessage('');
        setSnackbarSeverity('');
      }, 3000);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} className="p-4">
      <div className="user-modal flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <p>{loadingMessage}</p>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          </div>
        ) : (
          <>
            <div className="flex border border-b p-6">
              <div className=" flex items-center justify-center ">
                <FiUserPlus size={25} />
              </div>
              <div className="ml-4">
                <p className="text-base font-semibold leading-6 text-gray-800">
                  Teammitglieder einladen
                </p>
                <p className="text-xs font-normal leading-4 text-gray-600">
                  Trage hier die E-Mails deiner Teammitglieder ein und wir senden ihnen eine
                  Einladung
                </p>
              </div>
            </div>
            <div className="modal-body px-6 pt-6">
              <div className="flex flex-col">
                <label className="text-xs font-medium leading-4 text-gray-700">Vorname</label>
                <input
                  onChange={handleInputChange}
                  value={userData.first_name}
                  required="required"
                  data-behavior="tagify"
                  className="mt-1 box-border h-8 border border-gray-300 bg-white pl-1  text-sm font-medium leading-5 text-gray-500 focus:outline-none"
                  type="text"
                  name="first_name"
                  id="first_name"
                />
              </div>
              <div className="mt-4 flex flex-col">
                <label className="text-xs font-medium leading-4 text-gray-700">Nachname</label>

                <input
                  onChange={handleInputChange}
                  value={userData.last_name}
                  required="required"
                  data-behavior="tagify"
                  className="mt-1 box-border h-8 border border-gray-300 bg-white pl-1  text-sm font-medium leading-5 text-gray-500 focus:outline-none"
                  type="text"
                  name="last_name"
                  id="last_name"
                />
              </div>
              <div className="mt-4 flex flex-col">
                <label className="text-xs font-medium leading-4 text-gray-700">
                  E-Mail Adresse
                </label>

                <input
                  onChange={handleInputChange}
                  value={userData.email}
                  required="required"
                  data-behavior="tagify"
                  className="mt-1 box-border h-8 border border-gray-300 bg-white pl-1  text-sm font-medium leading-5 text-gray-500 focus:outline-none"
                  type="text"
                  name="email"
                  id="email"
                />
              </div>
              <div className="mt-4 flex flex-col">
                <label className="text-xs font-medium leading-4 text-gray-700">Passwort</label>
                <input
                  onChange={handleInputChange}
                  value={userData.password}
                  required="required"
                  data-behavior="tagify"
                  className="mt-1 box-border h-8 border border-gray-300 bg-white pl-1  text-sm font-medium leading-5 text-gray-500 focus:outline-none"
                  type="text"
                  name="password"
                  id="password"
                />
              </div>
              <div className="mt-4 flex flex-col">
                <label className="text-gray-725 text-xs font-medium leading-4">Rolle</label>
                <div className="border-gray-325 mt-1 box-border w-full rounded-lg border  bg-white px-4 py-2">
                  <select
                    required="required"
                    className="text-gray-525 w-full cursor-pointer text-sm font-medium leading-5 focus:outline-none"
                    name="role_id"
                    id="role_id"
                    value={userData.role_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Wähle die Rolle aus</option>
                    <option value="1">Admin</option>
                    <option value="2">User</option>
                    <option value="3">Support</option>
                    <option value="4">Lagerleiter</option>
                    <option value="5">Pick</option>
                    <option value="6">Pack</option>
                    <option value="7">Retoure</option>
                  </select>
                </div>
              </div>
              <div className="ml-6 mt-8 flex w-full justify-end pb-4 pr-6 text-right">
                <div className="flex items-center">
                  <button
                    onClick={handleClose}
                    className="box-border border border-gray-300 bg-white px-4 py-2 text-sm font-semibold leading-5 text-gray-900 hover:border-gray-400"
                    id="cancel"
                  >
                    Stornieren
                  </button>
                  <button
                    onClick={handleSubmit}
                    name="commit"
                    className="ml-3 cursor-pointer bg-blue-500 px-4 py-2 text-sm font-semibold leading-5  text-white"
                    data-disable-with="Einladen"
                  >
                    Einladen
                  </button>
                </div>
              </div>
            </div>
            {/* <div className="mt-40 border-t px-5  pt-5">
              <div className="show-more mb-3 flex cursor-pointer items-center">
                <Link to="/dashboard/users" className="text-xs font-medium leading-4 text-blue-600">
                  Mehr
                </Link>
              </div>
            </div> */}
            {snackBar && (
              <CustomSnackBar
                message={snackBarMessage}
                severity={snackBarSeverity}
                duration={4000} // Adjust the duration as needed
                open={snackBar}
                handleClose={() => setSnackBar(false)}
              />
            )}
          </>
        )}
      </div>
    </Dialog>
  );
};
