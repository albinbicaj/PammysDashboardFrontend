import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/template';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, FormControlLabel, Checkbox, Typography } from '@mui/material';
import axiosInstance from '../../utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';

const DashboardAddPostPage = () => {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(true);
  const location = useLocation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    defaultValues,
  } = useForm({
    defaultValues: {
      shipping_mail_to_customer: false,
      active: false,
    },
  });
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();

  const handleCheckboxChange = () => setShowAdditionalInfo((prev) => !prev);

  const onSubmit = async (data) => {
    try {
      const apiEndpoint = id ? `/dashboard/shipping-method/${id}` : '/dashboard/shipping-method';
      const response = id
        ? await axiosInstance.put(apiEndpoint, data).then(() => {
            showToast('Daten erfolgreich aktualisiert', 'success');
          })
        : await axiosInstance.post(apiEndpoint, data).then(() => {
            showToast('Daten erfolgreich hinzugefügt', 'success');
          });
      if (response?.status == 200) {
        navigate(`/dashboard/post`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  useEffect(() => {
    if (id) {
      setShowAdditionalInfo(false);
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(`/dashboard/shipping-method/${id}`);
          const { data } = response;

          // Set values for checkboxes based on the data received
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
    }
  }, [id, reset, setValue]);

  return (
    <div className="xentral-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username */}

        <div className="mb-8 rounded-lg border bg-white px-4 py-5 shadow">
          <Typography variant="h6" component="h6" sx={{ minWidth: '150px' }}>
            {id ? 'Bearbeiten' : 'Erstellen'}
          </Typography>
          <div className="flex flex-col gap-4">
            <div className="mt-8 flex items-center gap-6">
              <Typography variant="p" component="p" sx={{ minWidth: '150px' }}>
                Bezeichnung:
              </Typography>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                rules={{ required: 'Username ist erforderlich' }}
                className="input"
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: '40%' }}
                    label="Benutzername"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-6">
              <Typography variant="p" component="p" sx={{ minWidth: '150px' }}>
                Passwort:
              </Typography>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: 'Password ist erforderlich' }}
                render={({ field }) => (
                  <TextField
                    sx={{ width: '40%' }}
                    {...field}
                    label="Passwort"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </div>
            <div className="flex items-center gap-6">
              <Typography variant="p" component="p" sx={{ minWidth: '150px' }}>
                Rechnungsnummer:
              </Typography>
              {/* Billing Number */}
              <Controller
                name="billing_number"
                control={control}
                defaultValue=""
                rules={{ required: 'Rechnungsnummer ist erforderlich' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: '40%' }}
                    label="Rechnungsnummer"
                    error={!!errors.billing_number}
                    helperText={errors.billing_number?.message}
                  />
                )}
              />
            </div>

            <div className="flex items-center gap-6">
              <Typography variant="p" component="p" sx={{ minWidth: '150px' }}>
                Produkt:
              </Typography>
              {/* Product */}
              <Controller
                name="product"
                control={control}
                defaultValue="DHL Paket International"
                rules={{ required: 'Produkt ist erforderlich' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: '40%' }}
                    label="Produkt"
                    error={!!errors.product}
                    helperText={errors.product?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-lg border bg-white px-4 py-5 shadow">
          {id && (
            <div className="mb-4">
              <FormControlLabel
                control={<Checkbox checked={showAdditionalInfo} onChange={handleCheckboxChange} />}
                label="Zusätzliche Informationen anzeigen"
              />
            </div>
          )}
          {showAdditionalInfo && (
            <>
              <div className="flex gap-4">
                <Controller
                  name="api_key"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'API-Schlüssel ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="API-Schlüssel"
                      fullWidth
                      error={!!errors.api_key}
                      helperText={errors.api_key?.message}
                    />
                  )}
                />

                {/* API URL */}
                <Controller
                  name="api_url"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'API URL ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="API URL"
                      fullWidth
                      error={!!errors.api_url}
                      helperText={errors.api_url?.message}
                    />
                  )}
                />

                {/* Shipping Method */}
                <Controller
                  name="shipping_method"
                  control={control}
                  defaultValue="dhl"
                  rules={{ required: 'Versandart ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Versandart"
                      fullWidth
                      error={!!errors.shipping_method}
                      helperText={errors.shipping_method?.message}
                    />
                  )}
                />

                {/* Parcel Document Type */}
                <Controller
                  name="parcel_document_type"
                  control={control}
                  defaultValue="pdf"
                  rules={{ required: 'Parzelle Dokumentenart ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Parzelle Dokumentenart"
                      fullWidth
                      error={!!errors.parcel_document_type}
                      helperText={errors.parcel_document_type?.message}
                    />
                  )}
                />
              </div>

              <div className="flex gap-4">
                {/* Sender Name */}
                <Controller
                  name="sender_name"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Name des Absenders ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name des Absenders"
                      fullWidth
                      error={!!errors.sender_name}
                      helperText={errors.sender_name?.message}
                    />
                  )}
                />

                {/* Sender Street */}
                <Controller
                  name="sender_street"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Sender Straße ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sender Straße"
                      fullWidth
                      error={!!errors.sender_street}
                      helperText={errors.sender_street?.message}
                    />
                  )}
                />

                {/* Sender House Number */}
                <Controller
                  name="sender_house_number"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Absender Hausnummer ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Absender Hausnummer"
                      fullWidth
                      error={!!errors.sender_house_number}
                      helperText={errors.sender_house_number?.message}
                    />
                  )}
                />

                {/* Sender City */}
                <Controller
                  name="sender_city"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Sender City ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sender Stadt"
                      fullWidth
                      error={!!errors.sender_city}
                      helperText={errors.sender_city?.message}
                    />
                  )}
                />
              </div>

              <div className="flex gap-4">
                {/* Sender Zip Code */}
                <Controller
                  name="sender_zip_code"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Absender-Postleitzahl ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Absender-Postleitzahl"
                      fullWidth
                      error={!!errors.sender_zip_code}
                      helperText={errors.sender_zip_code?.message}
                    />
                  )}
                />

                {/* Sender Country */}
                <Controller
                  name="sender_country"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Absenderland ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Absender Land"
                      fullWidth
                      error={!!errors.sender_country}
                      helperText={errors.sender_country?.message}
                    />
                  )}
                />

                {/* Sender Phone */}
                <Controller
                  name="sender_phone"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Absender Telefon ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Absender Telefon"
                      fullWidth
                      error={!!errors.sender_phone}
                      helperText={errors.sender_phone?.message}
                    />
                  )}
                />

                {/* Sender Email */}
                <Controller
                  name="sender_email"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Absender E-Mail ist erforderlich' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="email"
                      label="Absender E-Mail"
                      fullWidth
                      error={!!errors.sender_email}
                      helperText={errors.sender_email?.message}
                    />
                  )}
                />
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
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            {id ? 'Bearbeiten' : 'Erstellen'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default DashboardAddPostPage;
