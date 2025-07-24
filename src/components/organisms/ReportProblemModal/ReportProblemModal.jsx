import { Box, Modal } from '@mui/material';
import React from 'react';

const ReportProblemModal = ({ setShowModal, handleReportProblem, showModal }) => {
  const handleStep = (step) => {
    let problemText = '';
    switch (step) {
      case 1:
        problemText = 'Not generated, not created';
        break;
      default:
        break;
    }
    handleReportProblem({ value: problemText, label: problemText });
    setShowModal(false);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="overflow-hidden rounded">
        <div className="h-48 flex-col items-center justify-center gap-5">
          <h1 className="flex justify-center text-2xl font-bold">Report a Problem: </h1>
          <div className="flex justify-center pt-[55px]">
            <button
              className="bg-accent  px-4 py-2 text-sm font-semibold"
              onClick={() => handleStep(1)}
            >
              Not generated, not created
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ReportProblemModal;
