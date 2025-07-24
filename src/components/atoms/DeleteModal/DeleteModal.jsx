import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useState } from 'react';

export const DeleteModal = ({
  buttonText = 'Löschen',
  modalTitle = 'Mit der Löschung fortfahren?',
  confirmButton = () => {},
  cancelText = 'Abbrechen',
  deleteText = 'Löschen bestätigen',
  className = 'mt-4 border px-3 py-2 text-red-500',
}) => {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    confirmButton();
    setShowModal(false);
  };

  return (
    <>
      <button className={className} onClick={() => setShowModal(true)}>
        {buttonText}
      </button>
      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-modal-description"
        sx={{ bgcolor: 'rgba(156, 163, 175, 0.75)' }}
      >
        <Box sx={style}>
          <div className="mb-3 flex-col items-center ">
            <p
              className="modal-title text-center text-xl font-bold"
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              Delete
            </p>
            <div className="text-center text-base font-semibold leading-6 text-gray-800">
              {modalTitle}
            </div>
          </div>
          <div className="mt-10 flex items-center justify-center gap-5">
            <div>
              <button
                className="focus:border-blue-625 focus:shadow-btn_blue focus:border-blue-625 box-border border border-gray-300 px-4 py-2  text-sm font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
                onClick={handleClose}
              >
                {cancelText}
              </button>
            </div>
            <div>
              <button
                className="focus:border-blue-625 focus:shadow-btn_blue focus:border-blue-625 box-border border border-gray-300 bg-red-600 px-4 py-2  text-sm font-semibold leading-5 text-white hover:border-gray-400 focus:outline-none"
                onClick={handleConfirm}
              >
                {deleteText}
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
  minHeight: 160,
  bgcolor: '#fff',
  boxShadow: 24,
  pt: 4,
  px: 4,
  pb: 4,
};
