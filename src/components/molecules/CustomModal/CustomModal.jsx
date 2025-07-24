import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useOrderContext } from '../../../context/Order.context';
import { useNavigate } from 'react-router-dom';

export const CustomModal = ({ redirectTo, showModal, setShowModal }) => {
  const handleClose = () => {
    setShowModal(false);
  };
  const handleProceed = () => {
    window.location.href = 'https://pummys.returnsportal.online/';
  };
  return (
    <div className="text-center">
      <Modal
        className="text-center"
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="size-modal">
          <p id="modal-modal-title" variant="h6" component="h2">
            Umtausch
          </p>
          <p id="modal-modal-description" sx={{ mt: 2 }}>
            Möchtest du einen Umtausch anmelden? Wir übernehmen die Versandkosten für deine
            Rücksendung und lassen dir den Artikel in deiner Wunschgröße zukommen.
          </p>
          <div className="flex flex-col items-center justify-around">
            <div className="mb-2">
              <button
                onClick={() => {
                  handleProceed();
                }}
                className="confirm-button"
              >
                Umtausch anmelden
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  handleClose();
                }}
                className="link-button"
              >
                Nein, ich möchte den Artikel zurücksenden
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
