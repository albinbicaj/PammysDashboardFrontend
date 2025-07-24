import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axiosInstance from '../../../utils/axios';
import { CustomSnackBar } from '../../molecules';
import { FiUserPlus } from 'react-icons/fi';
import { notification } from '../../../utils/notification';
import { Controller, useForm } from 'react-hook-form'; // Import useForm from react-hook-form
import { Modal } from '@mui/material';

export const IncomingStockModal = ({
  open,
  handleClose,
  incomingStockState,
  fetchProducts,
  incomingStockModal,
  page,
  rowsPerPage,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm();

  // useEffect(() => {
  //   if (incomingStockModal) {
  //     const fetchData = async () => {
  //       try {
  //         const { data } = await axiosInstance.get(
  //           `/incoming-stock/show/${incomingStockState?.newId}`,
  //         );
  //         setValue('arriving_at', data.stock.arriving_at || ''); // Fill the arriving_at field
  //         setValue('ordered_quantity', data.stock.ordered_quantity || ''); // Fill the ordered_quantity field
  //         setValue('arrived_quantity', data.stock.arrived_quantity || ''); // Fill the arrived_quantity field
  //       } catch (error) {
  //         console.error('Error fetching incoming stock:', error);
  //       }
  //     };

  //     if (open) {
  //       fetchData();
  //     }
  //   } else {
  //     setValue('arriving_at', '');
  //     setValue('ordered_quantity', '');
  //     setValue('arrived_quantity', '');
  //   }
  // }, [open, incomingStockState.productVariantId, setValue, incomingStockModal]);

  const onSubmit = async (data) => {
    try {
      let method = 'POST';
      let apiEndpoint = '/incoming-stock/store';

      if (incomingStockModal) {
        method = 'PUT';
        apiEndpoint = `/incoming-stock/update/${incomingStockState?.newId}`;
      }

      const requestData = {
        ...data,
        product_variant_id: incomingStockState?.productVariantId,
        variant_id: incomingStockState?.variantId,
        barcode_number: incomingStockState?.barcode,
        title: incomingStockState?.title,
      };

      const response = await axiosInstance({
        method: method,
        url: apiEndpoint,
        data: requestData,
      });

      await fetchProducts(`?page=${page + 1}&paginate=${rowsPerPage}`);
      reset();
      handleClose();
    } catch (error) {
      console.error('Error submitting data:', error);
      handleClose();
    }
  };

  const today = new Date().toISOString().split('T')[0];

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
          <>
            <div className=" mb-3 flex items-center justify-center">
              <p className="modal-title text-center text-xl font-bold">Eingehender Bestand</p>
            </div>
            <div className=" px-6 pt-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                  <label className="label">Ankommen bei</label>
                  <Controller
                    name="arriving_at"
                    control={control}
                    defaultValue={null}
                    rules={{ required: 'Ankommen bei ist erforderlich' }}
                    render={({ field }) => (
                      <input type="date" {...field} className="input" min={today} />
                    )}
                  />
                  {errors.arriving_at && <span>{errors.arriving_at.message}</span>}
                </div>

                <div className="mt-4 flex flex-col">
                  <label className="label">Bestellte Menge</label>
                  <input
                    {...register('ordered_quantity', { required: true })} // Register the input field
                    className="input"
                    type="number"
                    id="ordered_quantity"
                  />
                  {errors.ordered_quantity && <span>Dieses Feld ist erforderlich</span>}
                </div>

                <div className="mt-4 flex flex-col">
                  <label className="label">Angekommen Menge</label>
                  <input
                    {...register('arrived_quantity', { required: true })} // Register the input field
                    className="input"
                    type="number"
                    id="arrived_quantity"
                  />
                  {errors.arrived_quantity && <span>Dieses Feld ist erforderlich</span>}
                </div>

                <div className="mt-10 flex w-full justify-center text-right">
                  <div className="flex items-center gap-5">
                    <div onClick={handleClose} className="btn btn-default" id="cancel">
                      Abbrechen
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Speichern Sie
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
