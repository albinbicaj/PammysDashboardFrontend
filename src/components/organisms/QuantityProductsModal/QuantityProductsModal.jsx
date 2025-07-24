import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Controller } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import PermissionCheck from '../../molecules/PermissionCheck/PermissionCheck';
import { FormControl, TextField } from '@mui/material';

export const QuantityProductsModal = ({
  openModal,
  setOpenModal,
  calculationState,
  setIsCheckboxError,
  reset,
  quantityToUpdate,
  setQuantityToUpdate,
  control,
  validateCheckboxes,
  isCheckboxError,
  saving,
  handleModalSave,
}) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleModalSave();
    }
  };
  return (
    <Modal
      open={openModal}
      onClose={() => {
        setOpenModal(false);
        setIsCheckboxError(false);
        reset({
          shopify: false,
          db: false,
        });
      }}
      aria-labelledby="modal-title"
      aria-describedby="modal-modal-description"
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
      >
        <div className=" mb-3 flex items-center justify-center">
          <p className="modal-title text-center text-xl font-bold">
            {calculationState ? 'Inkrement Menge' : 'Dekrement Menge'}
          </p>
        </div>
        <Typography id="modal-modal-description" className="mt-[2px]">
          <div className="flex flex-col gap-3">
            <FormControl fullWidth>
              <Typography variant="body1" sx={{ marginBottom: '3px' }}>
                Menge anpassen:
              </Typography>
              <TextField
                autoFocus
                fullWidth
                type="number"
                value={quantityToUpdate}
                onChange={(e) => setQuantityToUpdate(parseInt(e.target.value))}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                inputProps={{
                  style: {
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    height: '20px',
                  },
                }}
              />
            </FormControl>
            <PermissionCheck>
              <div className="flex flex-col">
                <div className="flex justify-between">
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
                            size="small"
                            onChange={(e) => {
                              onChange(e.target.checked);
                              validateCheckboxes();
                            }}
                          />
                        )}
                      />
                    }
                    label="Shopify Produkt"
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
                            size="small"
                            onChange={(e) => {
                              onChange(e.target.checked);
                              validateCheckboxes();
                            }}
                          />
                        )}
                      />
                    }
                    label="Backend Produkt"
                  />
                </div>
                {isCheckboxError && (
                  <span className="text-left text-sm text-red-500">
                    Bitte wählen Sie mindestens eine Option aus.
                  </span>
                )}
              </div>
            </PermissionCheck>
            <button className="btn btn-primary" disabled={saving} onClick={handleModalSave}>
              {saving ? 'Sparen...' : 'Speichern Sie'}
            </button>
          </div>
        </Typography>
      </Box>
    </Modal>
  );
};
