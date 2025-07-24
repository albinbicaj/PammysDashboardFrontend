import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 620,
  bgcolor: '#fff',
  boxShadow: 24,
  pt: 4,
  px: 4,
  pb: 4,
};
export const WarningModal = ({
  showModal,
  confirm,
  setShowModal,
  modalTitle,
  modalDescription,
}) => {
  const handleClose = () => {
    setShowModal(false);
  };
  const handleConfirm = () => {
    confirm();
    handleClose();
  };
  return (
    <div className="warning-modal">
      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ bgcolor: 'rgba(156, 163, 175, 0.75)' }}
      >
        <Box sx={style}>
          <p
            className="modal-title text-center text-xl font-bold"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {modalTitle}
          </p>
          <p
            className="modal-description text-center text-base font-semibold leading-6 text-gray-800"
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            {modalDescription}
          </p>
          <div className="mt-5 flex items-center justify-center gap-5">
            <button
              onClick={handleClose}
              className="cancel-button w-[fit-content] border-2 px-2 pb-[0px]"
            >
              Abbrechen
            </button>

            <button
              onClick={handleConfirm}
              className="delete-button w-[fit-content] border-2 px-2 pb-[0px]"
            >
              Löschen
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
