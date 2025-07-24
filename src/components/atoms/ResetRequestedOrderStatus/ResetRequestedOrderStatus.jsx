import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useState } from 'react';

export const ResetRequestedOrderStatus = ({ onConfirm }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };
  const handleOpen = () => {
    setShowModal(true);
  };
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <>
      <button className="mt-4 border px-3 py-2 " onClick={handleOpen}>
        Wiederherstellen
      </button>

      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{ bgcolor: 'rgba(156, 163, 175, 0.75)' }}
      >
        <Box sx={style}>
          <div className="mb-3 flex-col items-center">
            <p className="modal-title text-center text-xl font-bold">Reset Requested Order State</p>
            <div className="text-center text-base font-semibold leading-6 text-gray-800">
              Are you sure you want to reset the requested order state?
            </div>
          </div>
          <div className="mt-10 flex items-center justify-center gap-5">
            <div>
              <button
                className="focus:border-blue-625  focus:shadow-btn_blue focus:border-blue-625 box-border border border-gray-300  px-4 py-2  text-sm font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
                onClick={handleClose}
              >
                abbrechen
              </button>
            </div>
            <div>
              <button
                className="focus:border-blue-625 focus:shadow-btn_blue focus:border-blue-625 bg-accent px-6 py-2     text-sm font-semibold leading-5 hover:border-gray-400 focus:outline-none"
                onClick={handleConfirm}
              >
                Wiederherstellen
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 570,
  bgcolor: '#fff',
  boxShadow: 24,
  pt: 4,
  px: 4,
  pb: 4,
};
