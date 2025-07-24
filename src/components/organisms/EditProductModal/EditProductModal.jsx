import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axiosInstance from '../../../utils/axios';
import { CustomSnackBar } from '../../molecules';
import { FiUserPlus } from 'react-icons/fi';
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form'; // Import useForm from react-hook-form
import { Modal, Typography } from '@mui/material';
import showToast from '../../../hooks/useToast';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export const EditProductModal = ({ open, handleClose, fetchProducts, productId }) => {
  const [shopifyVariantId, setShopifyVariantId] = useState(true);
  const [productData, setProductData] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isCheckboxError, setIsCheckboxError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    getValues,
  } = useForm();
  const getProductById = async (productId) => {
    try {
      const response = await axiosInstance.get(`/product/product/${productId}`);
      const data = response.data;
      setShopifyVariantId(data?.shopify_variant_id);
      setProductData(data);
      let formattedStorageLocation = data.storage_location;
      if (formattedStorageLocation) {
        formattedStorageLocation = formattedStorageLocation.replace(/\./g, '');
        if (formattedStorageLocation.length >= 4) {
          formattedStorageLocation =
            formattedStorageLocation.substring(0, 2) +
            '.' +
            formattedStorageLocation.substring(2, 4) +
            '.' +
            formattedStorageLocation.substring(4, 6);
        }
      }
      reset({
        title: data.title,
        sku: data.sku,
        barcode_number: data.barcode_number,
        weight: data.weight,
        weight_unit: { value: data.weight_unit, label: data.weight_unit },
        storage_location: formattedStorageLocation ? formattedStorageLocation : null,
        physical_stock: data.physical_stock ? data.physical_stock : 0,
        quantity_in_box: data.quantity_in_box ? data.quantity_in_box : 0,
        shopify: false,
        db: false,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    if (productId) {
      reset({
        title: null,
        sku: null,
        barcode_number: null,
        weight: null,
        weight_unit: null,
        storage_location: null,
        physical_stock: null,
        shopify: false,
        db: false,
      });
      getProductById(productId);
    }
  }, [productId, handleClose]);

  const onSubmit = async (data) => {
    data.weight_unit = data?.weight_unit?.value;
    data.storage_location = data.storage_location.replace(/\./g, '');
    if (!data.shopify && !data.db) {
      setIsCheckboxError(true);
      return;
    }
    data.update_target = data.shopify && data.db ? 'both' : data.shopify ? 'shopify' : 'db';
    delete data.db;
    delete data.shopify;
    setLoadingButton(true);
    try {
      await axiosInstance.put(`/product/edit-product/${shopifyVariantId}`, data).then(() => {
        showToast('Produkt erfolgreich aktualisiert', 'success');
        fetchProducts();
        handleClose();
        setIsCheckboxError(false);
        setLoadingButton(false);
      });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const validateCheckboxes = () => {
    const values = getValues();
    const isValid = values.shopify || values.db;
    setIsCheckboxError(!isValid);
    return isValid;
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setIsCheckboxError(false);
      }}
      aria-labelledby="edit-product-modal-title"
      aria-describedby="edit-product-modal-description"
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
          pt: 4,
          px: 4,
          pb: 4,
        }}
        onClick={() => {
          // handleClose();
          setIsCheckboxError(false);
        }}
      >
        <div className="flex flex-col">
          <>
            <div className="flex  pb-6">
              <div>
                <p className="text-base font-semibold leading-6 text-gray-800">
                  <div className="flex items-center gap-1">
                    <Typography
                      color="#718093"
                      variant="span"
                      component="span"
                      fontWeight="bold"
                      fontSize="14px"
                    >
                      Produkt
                    </Typography>
                    <Typography
                      color="#48509e"
                      variant="h6"
                      component="h6"
                      fontWeight="bold"
                      fontSize="14px"
                    >
                      {productData?.sku}
                    </Typography>
                  </div>
                </p>
                <p className="text-sm"> {productData?.title}</p>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                  <label className="label"> Artikel(DE)</label>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                    render={({ field }) => (
                      <div className="flex flex-col items-center gap-2">
                        <input
                          {...field}
                          className={`input   ${errors.title ? 'border-red-500' : ''}`}
                        />
                        {errors.title && (
                          <span className="text-red-500">{errors.title.message}</span>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="mt-4 flex flex-col">
                  <label className="label">Artikel no.:</label>
                  <Controller
                    name="sku"
                    control={control}
                    rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                    render={({ field }) => (
                      <div className="flex flex-col items-center gap-2">
                        <input
                          {...field}
                          className={`input   ${errors.sku ? 'border-red-500' : ''}`}
                        />
                        {errors.sku && <span className="text-red-500">{errors.sku.message}</span>}
                      </div>
                    )}
                  />
                </div>
                <div className="mt-4 flex flex-col">
                  <label className="label">EAN no./ barcode:</label>
                  <Controller
                    name="barcode_number"
                    control={control}
                    rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                    render={({ field }) => (
                      <div className="flex flex-col items-center gap-2">
                        <input
                          {...field}
                          disabled
                          className={`input   ${errors.barcode_number ? 'border-red-500' : ''}`}
                        />
                        {errors.barcode_number && (
                          <span className="text-red-500">{errors.barcode_number.message}</span>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <div className="mt-4 flex flex-1 flex-col">
                    <label className="label">Lagerbestand</label>
                    <Controller
                      name="physical_stock"
                      control={control}
                      rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                      render={({ field }) => (
                        <>
                          <div className="flex flex-col items-center gap-2">
                            <input
                              {...field}
                              className={`input   ${errors.physical_stock ? 'border-red-500' : ''}`}
                            />
                            {errors.physical_stock && (
                              <span className="text-red-500">{errors.physical_stock.message}</span>
                            )}
                          </div>
                        </>
                      )}
                    />
                  </div>

                  <div className="mt-4 flex flex-1 flex-col">
                    <label className="label">Regal:</label>
                    <Controller
                      name="storage_location"
                      control={control}
                      rules={{
                        required: 'This field is required',
                        pattern: {
                          value: /^[0-9.]+$/, // Allow numbers and dots
                          message: 'Only numbers and dots are allowed',
                        },
                        validate: (value) =>
                          value.replace(/\D/g, '').length === 6 || 'Please enter exactly 6 numbers',
                      }}
                      render={({ field: { onChange, value } }) => (
                        <div className="flex flex-col items-center gap-2">
                          <input
                            className={`input ${errors.storage_location ? 'border-red-500' : ''}`}
                            type="text"
                            id="storage_location"
                            value={value || ''}
                            onChange={(e) => {
                              let input = e.target.value.replace(/[^\d.]/g, '').substring(0, 8);
                              let formattedInput = input;
                              input = input.replace(/\./g, '');

                              if (input.length > 2) {
                                formattedInput =
                                  input.substring(0, 2) + '.' + input.substring(2, 4);
                                if (input.length > 4) {
                                  formattedInput = formattedInput + '.' + input.substring(4, 6);
                                }
                              }
                              onChange(formattedInput);
                            }}
                            onKeyDown={(e) => {
                              if (
                                !/[0-9.]/.test(e.key) &&
                                e.key !== 'Backspace' &&
                                e.key !== 'Delete' &&
                                !['ArrowLeft', 'ArrowRight'].includes(e.key)
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                          {errors.storage_location && (
                            <span className="text-red-500">{errors.storage_location.message}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <div className="mt-4 flex flex-1 flex-col">
                    <label className="label">Gewicht in (kg):</label>
                    <Controller
                      name="weight"
                      control={control}
                      rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            className={`input  ${errors.weight ? 'border-red-500' : ''}`}
                          />
                          {errors.weight && (
                            <span className="text-red-500">{errors.weight.message}</span>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="mt-4 flex flex-1 flex-col">
                    <label className="label">Gewichtseinheit:</label>
                    <Controller
                      name="weight_unit"
                      control={control}
                      rules={{ required: 'Artikelbezeichnung ist erforderlich' }}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            // className={` input ${errors.weight_unit ? 'border-red-500' : ''}`}
                            placeholder="Wählen Sie eine..."
                            className=""
                            options={[
                              { value: 'kg', label: 'kg' },
                              { value: 'g', label: 'g' },
                            ]}
                          />
                          {errors.weight_unit && (
                            <span className="text-red-500">{errors.weight_unit.message}</span>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-col">
                  <label className="label">Menge in der Box:</label>
                  <Controller
                    name="quantity_in_box"
                    control={control}
                    rules={{
                      required: 'Menge in der Box ist erforderlich',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Nur ganze Zahlen sind erlaubt',
                      },
                    }}
                    render={({ field }) => (
                      <div className="flex flex-col items-center gap-2">
                        <input
                          {...field}
                          type="number"
                          className={`input ${errors.quantity_in_box ? 'border-red-500' : ''}`}
                        />
                        {errors.quantity_in_box && (
                          <span className="text-red-500">{errors.quantity_in_box.message}</span>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className="flex justify-between gap-4 pt-2">
                  <FormControlLabel
                    control={
                      <Controller
                        name="shopify"
                        control={control}
                        rules={{ validate: validateCheckboxes }}
                        render={({ field: { onChange, value, ...field } }) => (
                          <Checkbox
                            {...field}
                            checked={!!value}
                            size="medium"
                            onChange={(e) => {
                              onChange(e.target.checked);
                              validateCheckboxes();
                            }}
                          />
                        )}
                      />
                    }
                    label="Änderung in Shopify"
                  />

                  <FormControlLabel
                    control={
                      <Controller
                        name="db"
                        control={control}
                        rules={{ validate: validateCheckboxes }}
                        render={({ field: { onChange, value, ...field } }) => (
                          <Checkbox
                            {...field}
                            checked={!!value}
                            size="medium"
                            onChange={(e) => {
                              onChange(e.target.checked);
                              validateCheckboxes();
                            }}
                          />
                        )}
                      />
                    }
                    label="Änderung im DB"
                  />
                </div>

                {isCheckboxError && (
                  <span className="text-left text-sm text-red-500">
                    Bitte wählen Sie mindestens eine Option aus.
                  </span>
                )}
                <div className="mt-10 flex w-full justify-center text-right">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => {
                        handleClose();
                        setIsCheckboxError(false);
                      }}
                      className="btn btn-default"
                      id="cancel"
                    >
                      Abbrechen
                    </div>
                    <button type="submit" disabled={loadingButton} className="btn btn-primary">
                      {loadingButton ? 'Aktualisierung von...' : 'Speichern Sie'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        </div>
      </Box>
    </Modal>
  );
};
