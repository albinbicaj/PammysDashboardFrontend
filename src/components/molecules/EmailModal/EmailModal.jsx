import React from 'react';
import { Modal, Box } from '@mui/material';
import { CloseModalIcon } from '../../atoms/CloseModalIcon/CloseModalIcon';

const EmailModal = ({ open, onClose, emailHtml, subjectTitle }) => {
  const backdropPropStyle = {
    backgroundColor: 'rgba(156, 163, 175, 0.75)',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        style: backdropPropStyle,
      }}
    >
      <Box className="md:w-7/10 absolute left-1/2 top-1/2 w-2/5 -translate-x-1/2 -translate-y-1/2 transform bg-white">
        <div className="bg-seashell border-platinum border-b p-[25px]">
          <div className="flex items-center justify-between">
            <h2 id="modal-modal-title" className="text-xs18 font-600 m-0">
              {`View "${subjectTitle}" email`}
            </h2>
            <div onClick={onClose} className="h-[25px] w-[25px] cursor-pointer">
              <CloseModalIcon />
            </div>
          </div>
        </div>
        <div className="bg-platinum-100 border-platinum-300 scrollbar-hide m-5 max-h-[420px] overflow-y-auto border">
          <h3 className="z-9 border-platinum-300 sticky top-0 m-0 border-b bg-white p-[15px_20px] text-base font-bold">
            Subject: {subjectTitle}
          </h3>
          <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
        </div>
        <div className="border-platinum border-t bg-white p-[35px]"></div>
      </Box>
    </Modal>
  );
};

export default EmailModal;
