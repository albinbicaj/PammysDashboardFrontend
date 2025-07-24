import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ReturnPortalLayout.css';
import axiosInstance from '../../utils/axios';

export const EditAddressLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [initialValues, setInitialValues] = useState({});
  const watchedFields = watch();
  const isFormChanged = JSON.stringify(initialValues) !== JSON.stringify(watchedFields);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/edit-address/${token}`);
        setInitialValues(response.data);
        reset(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching address:', error);
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [token, reset]);

  const onSubmit = async (data) => {
    try {
      //   const response = await axiosInstance.post('order/update-shipping-address', data);
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
    }
  };

  return (
    <div className="login-layout flex h-screen  items-center justify-center bg-mobileBgImage bg-cover bg-no-repeat text-center sm:bg-bgImage">
      <div className="hidden h-20 w-1/3 2xl:block"></div>
      <div className="mx-2.5 max-h-screen max-w-xl text-center">
        <div className="min-h-96 border bg-white">
          <div className={`flex items-center justify-center border-b bg-white px-4 lg:px-6`}>
            <img
              className="my-4 max-w-32 bg-cover"
              src="/images/new/logo-new.svg"
              alt="Pammy's Logo."
            />
          </div>

          <div className=" max-h-[550px] min-h-[450px] overflow-y-auto p-5 text-left">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Adresse bearbeiten
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Vornamen
                  </Typography>
                  <Controller
                    name="first_name"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                  <Controller
                    name="country_code"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input
                          className="hidden h-8 w-full rounded-md border pl-2 text-sm"
                          {...field}
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="order_shopify_id"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input
                          className="hidden h-8 w-full rounded-md border pl-2 text-sm"
                          {...field}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Nachname
                  </Typography>
                  <Controller
                    name="last_name"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                </div>
              </div>
              <div>
                <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                  Straße und Hausnummer
                </Typography>
                <Controller
                  name="address1"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div>
                      <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                    </div>
                  )}
                />
              </div>
              <div>
                <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                  Zusätzliche Adresse
                </Typography>
                <Controller
                  name="address2"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div>
                      <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Postleitzahl
                  </Typography>
                  <Controller
                    name="zip"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Stadt
                  </Typography>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                </div>
              </div>
              <div>
                <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                  Land/Region
                </Typography>
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div>
                      <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                    </div>
                  )}
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <div className="flex items-center gap-3">
                  <button
                    className="btn btn-primary rounded-none"
                    disabled={!isFormChanged || isLoading}
                  >
                    {isLoading ? 'Aktualisierung...' : 'Speichern Sie'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-3 flex h-20 items-center justify-center gap-4 border bg-white px-4">
          <div>
            <svg
              width="41"
              height="41"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20.5" cy="20.5" r="19.5" fill="#E0FFE1" stroke="#98EF9B"></circle>
              <path
                d="M20.9168 28.0763C15.4386 29.1034 12.9908 26.342 12.3572 24.6524C8.50517 14.3808 23.77 10.1011 32.0443 10.5291C25.6246 12.669 27.7645 26.7923 20.9168 28.0763Z"
                fill="#50B153"
              ></path>
              <path
                d="M23.9114 15.6641C19.917 18.0893 11.8424 24.6517 11.5 31.4994"
                stroke="#38903D"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>
          <div className=" text-left">Pammys™ {t('returnPortalLayout.footerText')}</div>
        </div>
      </div>
    </div>
  );
};
