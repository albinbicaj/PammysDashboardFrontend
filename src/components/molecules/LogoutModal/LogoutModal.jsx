import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 470,
  minHeight: 160,
  bgcolor: '#fff',
  p: 4,
  borderRadius: '6px',
};
export const LogoutModal = ({ showModal, setShowModal, confirmButton }) => {
  const handleClose = () => {
    setShowModal(false);
  };
  return (
    <div>
      <Modal open={showModal} onClose={handleClose}>
        <Box sx={style}>
          <div className="mb-3 flex items-center">
            <div className="text-base font-semibold leading-6 text-gray-800">Are you sure?</div>
          </div>
          <div className="absolute bottom-6 right-6 flex justify-end">
            <button
              onClick={handleClose}
              className="focus:border-blue-625 focus:shadow-btn_blue focus:border-blue-625 box-border border border-gray-300 px-4 py-2  text-sm font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
            >
              Abbrechen
            </button>
            <button
              onClick={confirmButton}
              className="logout-button ml-3 px-4 py-2  text-sm font-semibold leading-5 text-white  focus:outline-none "
            >
              Confirm
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
