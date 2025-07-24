import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Modal } from '@mui/material';
import axiosInstance from '../../../utils/axios';
import { FiUserPlus } from 'react-icons/fi';
import { useAuthContext } from '../../../context/Auth.context';
import { RoleEnum } from '../../../enums/Role.enum';
import showToast from '../../../hooks/useToast';
import { IconButton } from '@mui/material';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export const UserModal = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '',
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required('Vorname ist erforderlich'),
    last_name: Yup.string().required('Nachname ist erforderlich'),
    email: Yup.string().email('Ungültige E-Mail-Adresse').required('E-Mail ist erforderlich'),
    password: Yup.string().required('Passwort ist erforderlich'),
    role_id: Yup.string().required('Rolle ist erforderlich'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      setLoadingMessage('Adding new user');
      const response = await axiosInstance.post('/auth/register', values);
      setLoading(false);
      setLoadingMessage('');
      showToast(response.data.message, 'success');
      resetForm();
      handleClose();
      navigate('/dashboard/users');
    } catch (error) {
      setLoading(false);
      setLoadingMessage('');
      const errorMessages = Object.keys(error.response.data.errors).map(
        (field) => error.response.data.errors[field][0],
      );
      showToast(errorMessages.join(', '), 'failure');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="user-modal-title"
      aria-describedby="user-modal-description"
      sx={{ bgcolor: 'rgba(156, 163, 175, 0.75)' }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 570,
          minHeight: 160,
          bgcolor: '#fff',
          boxShadow: 24,
          outline: 'none',
          pt: 4,
          px: 4,
          pb: 4,
        }}
      >
        <div className=" flex flex-col">
          {loading ? (
            <div className="flex min-h-[530px] flex-col items-center justify-center">
              <p>{loadingMessage}</p>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            </div>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="flex pb-6">
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
                  <div>
                    <div className="flex flex-col">
                      <label className="label">Vorname</label>
                      <Field name="first_name" type="text" className="input" as="input" />
                      <ErrorMessage name="first_name" component="div" className="text-red-500" />
                    </div>
                    <div className="mt-4 flex flex-col">
                      <label className="label">Nachname</label>
                      <Field name="last_name" type="text" className="input" as="input" />
                      <ErrorMessage name="last_name" component="div" className="text-red-500" />
                    </div>
                    <div className="mt-4 flex flex-col">
                      <label className="label">E-Mail Adresse</label>
                      <Field name="email" type="text" className="input" as="input" />
                      <ErrorMessage name="email" component="div" className="text-red-500" />
                    </div>
                    <div className="mt-4 flex flex-col">
                      <label className="label">Passwort</label>
                      <Field name="password">
                        {({ field }) => (
                          <div className="relative">
                            <input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              className="input"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 transform">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <IconEyeOff /> : <IconEye />}
                              </IconButton>
                            </span>
                          </div>
                        )}
                      </Field>
                      <ErrorMessage name="password" component="div" className="text-red-500" />
                    </div>
                    <div className="mt-4 flex flex-col">
                      <label className="label">Rolle</label>
                      <Field name="role_id" as="select" className="input">
                        <option value="">Wähle die Rolle aus</option>
                        {user?.role_id === RoleEnum.ADMIN ? (
                          <>
                            <option value="1">Admin</option>
                            <option value="2">User</option>
                            <option value="3">Support</option>
                            <option value="4">Lagerleiter</option>
                            <option value="5">Pick</option>
                            <option value="6">Pack</option>
                            <option value="7">Retoure</option>
                            <option value="8">IEM</option>
                          </>
                        ) : user?.role_id === RoleEnum.WAREHOUSE_EMPLOYEE ? (
                          <>
                            <option value="5">Pick</option>
                            <option value="6">Pack</option>
                            <option value="7">Retoure</option>
                          </>
                        ) : user?.role_id === RoleEnum.IEM ? (
                          <>
                            <option value="4">Lagerleiter</option>
                            <option value="5">Pick</option>
                            <option value="6">Pack</option>
                            <option value="7">Retoure</option>
                            <option value="8">IEM</option>
                          </>
                        ) : null}
                      </Field>
                      <ErrorMessage name="role_id" component="div" className="text-red-500" />
                    </div>
                    <div className="mt-10 flex w-full justify-center text-right">
                      <div className="flex items-center gap-5">
                        <button onClick={handleClose} className="btn btn-default" id="cancel">
                          Stornieren
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                          Einladen
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </Box>
    </Modal>
  );
};
