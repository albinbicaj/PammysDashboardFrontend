import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useAuthContext } from '../../context/Auth.context';
import axiosInstance from '../../utils/axios';
import showToast from '../../hooks/useToast';
import useIdleLogout from '../../hooks/useIdleLogout';
import { handleGenerateQRCode } from '../../utils/qrCodeUtils';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
import { Backdrop } from '@mui/material';

const DashboardProfilePage = () => {
  const { user, logout, fetchMe } = useAuthContext();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  useIdleLogout();

  const [credentials, setCredentials] = useState({
    current_password: '',
    new_password: '',
    qr_password: '',
    personio_employee_id: '',
    ip: user?.ip,
  });

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  useEffect(() => {
    console.log(user);
    setCredentials((prevData) => ({
      ...prevData,
      ip: user?.ip,
    }));
  }, [user]);

  const handleLogout = async () => {
    setOpenBackdrop(true);
    await logout();
    setOpenBackdrop(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = async () => {
    if (credentials.new_password.length < 6 && credentials.new_password.length > 1) {
      showToast('New password must be at least 6 characters long!', 'failure');
      return false;
    }
    setLoading(true);
    setLoadingMessage('Updating data');
    try {
      const response = await axiosInstance.post('/auth/change-password', {
        current_password: credentials.current_password,
        new_password: credentials.new_password,
        ip: credentials.ip,
        personio_id: credentials.personio_employee_id,
      });

      setLoading(false);
      setLoadingMessage('');
      showToast(response.data.message, 'success');

      setCredentials({
        current_password: '',
        new_password: '',
      });
    } catch (error) {
      setLoading(false);
      setLoadingMessage('');
      showToast(error.response.data.message, 'failure');
    } finally {
      fetchMe();
    }
  };

  return (
    <div className="mx-auto min-w-[400px] max-w-[1600px]">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PammysLoading />
      </Backdrop>
      <div className="space-y-5">
        <div className="flex justify-between border bg-white p-4">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-medium">Konto</p>
            <p className="text-sm font-medium text-gray-500">
              Aktualisiere deine Kontoeinstellungen
            </p>
          </div>
          <div>
            <div className="">
              <button onClick={handleLogout} className="btn btn-secondary">
                Ausloggen
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <p>{loadingMessage}</p>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 border bg-white p-4">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div className="">
                  <label className="text-sm leading-4 text-gray-950">Vorname</label>
                  <input disabled name="first_name" className="input" value={user?.first_name} />
                </div>
                <div className="">
                  <label className="text-sm leading-4 text-gray-950">Nachname</label>
                  <input disabled name="last_name" className="input" value={user?.last_name} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div className="">
                  <label className="text-sm leading-4 text-gray-950">E-Mail</label>
                  <input disabled name="email" className="input" value={user?.email} />
                </div>
                <div className="">
                  <label className="text-sm leading-4 text-gray-950">IP Address</label>
                  <input
                    onChange={handleInputChange}
                    name="ip"
                    className="input"
                    value={credentials?.ip || user?.ip}
                  />
                </div>
                <div className="">
                  <label className="text-sm leading-4 text-gray-950">Personio ID</label>
                  <input
                    onChange={handleInputChange}
                    name="personio_employee_id"
                    className="input"
                    value={credentials?.personio_employee_id || user?.personio_employee_id}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div className="">
                  <label className="text-sm leading-4 text-gray-950">Aktuelles Passwort</label>
                  <input
                    onChange={handleInputChange}
                    type="password"
                    name="current_password"
                    className="input"
                    value={credentials.current_password}
                  />
                </div>
                <div className="">
                  <label className="text-sm leading-4 text-gray-950 sm:mt-4">Neues Passwort</label>
                  <input
                    onChange={handleInputChange}
                    type="password"
                    name="new_password"
                    className="input"
                    value={credentials.new_password}
                  />
                </div>
              </div>
              <div className="text-right">
                <button onClick={handlePasswordChange} className="btn btn-primary">
                  Speichern
                </button>
              </div>
            </div>

            <div className="mt-4 flex  justify-between gap-3 border bg-white p-4">
              <div className="">
                <h2 className="text-lg font-medium">Generate QR Code</h2>
                <p className="text-sm font-medium text-gray-500">
                  Used for warehouse login with scan
                </p>
              </div>

              <div className="">
                <button
                  onClick={() =>
                    handleGenerateQRCode(
                      user?.id,
                      `${user?.first_name}_${user?.last_name}_qr_code`,
                      user?.first_name,
                      user?.last_name,
                    )
                  }
                  className="btn btn-secondary"
                >
                  Generate QR Code
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardProfilePage;
