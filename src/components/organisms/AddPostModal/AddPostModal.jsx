import React, { useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel, Modal, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import axiosInstance from '../../../utils/axios';
import showToast from '../../../hooks/useToast';

// Custom input component
const CustomInput = ({ field, label, error, helperText }) => (
  <div className="flex flex-1 flex-col items-center gap-2">
    <input {...field} className={`input ${error ? 'border-red-500' : ''}`} placeholder={label} />
    {error && <span className="text-red-500">{helperText}</span>}
  </div>
);

export const AddPostModal = ({ open, handleClose = () => {}, fetchData, postId }) => {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      shipping_mail_to_customer: false,
      active: false,
    },
  });

  const handleCheckboxChange = (e) => {
    setShowAdditionalInfo((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const apiEndpoint = postId
        ? `/dashboard/shipping-method/${postId}`
        : '/dashboard/shipping-method';
      const response = postId
        ? await axiosInstance.put(apiEndpoint, data).then(() => {
            showToast('Data successfully updated', 'success');
          })
        : await axiosInstance.post(apiEndpoint, data).then(() => {
            showToast('Data successfully added', 'success');
          });
      if (response?.status === 200) {
        handleClose();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      handleClose();
    }
  };

  useEffect(() => {
    reset({});
    if (postId) {
      setShowAdditionalInfo(false);
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(`/dashboard/shipping-method/${postId}`);
          const { data } = response;

          setValue(
            'shipping_mail_to_customer',
            data?.shipping_method?.shipping_mail_to_customer === 1,
          );
          setValue('active', data?.shipping_method?.active === 1);

          reset(data?.shipping_method);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    } else {
      setShowAdditionalInfo(true);
      reset({});
    }
  }, [postId, reset, setValue]);

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
          width: 670,
          minHeight: 160,
          bgcolor: '#fff',
          boxShadow: 24,
          outline: 'none',
          maxHeight: '500px',
          overflowY: 'scroll',
          pt: 4,
          px: 4,
          pb: 4,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <div className=" mb-3 flex items-center justify-center">
                <p className="modal-title text-center text-xl font-bold">
                  {postId ? 'Bearbeiten' : 'Erstellen'}
                </p>
              </div>
              <div className="my-2 flex gap-4">
                <div className="flex flex-1 flex-col">
                  <label className="label"> Bezeichnung:</label>
                  <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Username ist erforderlich' }}
                    className="input"
                    render={({ field }) => (
                      <CustomInput
                        field={field}
                        label="Benutzername"
                        error={!!errors.username}
                        helperText={errors.username?.message}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <label className="label"> Passwort:</label>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Password ist erforderlich' }}
                    render={({ field }) => (
                      <CustomInput
                        field={field}
                        label="Passwort"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="my-2 flex gap-4">
                <div className="flex flex-1 flex-col">
                  <label className="label"> Rechnungsnummer:</label>
                  <Controller
                    name="billing_number"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Rechnungsnummer ist erforderlich' }}
                    render={({ field }) => (
                      <CustomInput
                        field={field}
                        label="Rechnungsnummer"
                        error={!!errors.billing_number}
                        helperText={errors.billing_number?.message}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <label className="label"> Produkt:</label>
                  <Controller
                    name="product"
                    control={control}
                    defaultValue="DHL Paket International"
                    rules={{ required: 'Produkt ist erforderlich' }}
                    render={({ field }) => (
                      <CustomInput
                        field={field}
                        label="Produkt"
                        error={!!errors.product}
                        helperText={errors.product?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className={postId ? 'mt-2' : 'mt-5'}>
              {postId && (
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showAdditionalInfo ? true : false}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Zusätzliche Informationen anzeigen"
                  />
                </div>
              )}

              <div className={!showAdditionalInfo ? 'hidden' : 'block'}>
                <div className="mb-5 flex gap-4">
                  <div className="flex flex-1 flex-col">
                    <label className="label"> API-Schlüssel:</label>
                    <Controller
                      name="api_key"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'API-Schlüssel ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="API-Schlüssel"
                          error={!!errors.api_key}
                          helperText={errors.api_key?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <label className="label"> API URL:</label>
                    <Controller
                      name="api_url"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'API URL ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="API URL"
                          error={!!errors.api_url}
                          helperText={errors.api_url?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mb-5 flex flex-1 gap-4">
                  <div className="flex flex-1 flex-col">
                    <label className="label"> Versandart:</label>
                    <Controller
                      name="shipping_method"
                      control={control}
                      defaultValue="dhl"
                      rules={{ required: 'Versandart ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="Versandart"
                          error={!!errors.shipping_method}
                          helperText={errors.shipping_method?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <label className="label"> Parzelle Dokumentenart:</label>
                    <Controller
                      name="parcel_document_type"
                      control={control}
                      defaultValue="pdf"
                      rules={{ required: 'Parzelle Dokumentenart ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="Parzelle Dokumentenart"
                          error={!!errors.parcel_document_type}
                          helperText={errors.parcel_document_type?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mb-5 flex flex-1 gap-4">
                  <div className="flex flex-1 flex-col">
                    <label className="label"> Name des Absenders:</label>
                    <Controller
                      name="sender_name"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Name des Absenders ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="Name des Absenders"
                          error={!!errors.sender_name}
                          helperText={errors.sender_name?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <label className="label"> Sender Straße:</label>
                    <Controller
                      name="sender_street"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Sender Straße ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="Sender Straße"
                          error={!!errors.sender_street}
                          helperText={errors.sender_street?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mb-5 flex gap-4">
                  <div className="flex flex-1 flex-col">
                    <label className="label"> Absender Hausnummer:</label>
                    <Controller
                      name="sender_house_number"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Absender Hausnummer ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="Absender Hausnummer"
                          error={!!errors.sender_house_number}
                          helperText={errors.sender_house_number?.message}
                        />
                      )}
                    />
                  </div>

                  {/* Sender City */}
                  <div className="flex flex-1 flex-col">
                    <label className="label"> Sender City:</label>
                    <Controller
                      name="sender_city"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Sender City ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="Sender Stadt"
                          error={!!errors.sender_city}
                          helperText={errors.sender_city?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <label className="label"> Absender-Postleitzahl:</label>
                    <Controller
                      name="sender_zip_code"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Absender-Postleitzahl ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="Absender-Postleitzahl"
                          error={!!errors.sender_zip_code}
                          helperText={errors.sender_zip_code?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className=" flex gap-4">
                  <div className="flex flex-1 flex-col">
                    <label className="label"> Absenderland:</label>
                    <Controller
                      name="sender_country"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Absenderland ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="Absender Land"
                          error={!!errors.sender_country}
                          helperText={errors.sender_country?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <label className="label"> Absender Telefon:</label>
                    <Controller
                      name="sender_phone"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Absender Telefon ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="Absender Telefon"
                          error={!!errors.sender_phone}
                          helperText={errors.sender_phone?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <label className="label">Absender E-Mail:</label>
                    <Controller
                      name="sender_email"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Absender E-Mail ist erforderlich' }}
                      render={({ field }) => (
                        <CustomInput
                          field={field}
                          label="Absender E-Mail"
                          error={!!errors.sender_email}
                          helperText={errors.sender_email?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Shipping Mail to Customer */}

                <FormControlLabel
                  control={
                    <Controller
                      name="shipping_mail_to_customer"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox {...field} checked={field.value ?? false} color="primary" />
                      )}
                    />
                  }
                  label="Versand von Post an den Kunden"
                />

                {/* Active */}
                <FormControlLabel
                  control={
                    <Controller
                      name="active"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox {...field} checked={field.value ?? false} color="primary" />
                      )}
                    />
                  }
                  label="Aktiv"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-5">
            <div onClick={handleClose} className="btn btn-default" id="cancel">
              Abbrechen
            </div>
            <button type="submit" className="btn btn-primary">
              {postId ? 'Bearbeiten' : 'Erstellen'}
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};
