import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useTranslation } from 'react-i18next';

export const ReklamationNotification = () => {
  const [showModal, setShowModal] = useState(true);
  const { t } = useTranslation();

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="">
      <Modal
        open={showModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // sx={{
        //   backdropFilter: 'none',
        //   '& .MuiBackdrop-root': {
        //     backgroundColor: 'rgba(0, 0, 0, 1)', // Fully opaque black backdrop
        //   },
        // }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(156, 163, 175, 0.75)', // bg-gray-400 with 75% opacity
          },
        }}
      >
        <Box className="custom-modal max-h-[80%]  min-w-[350px] max-w-[450px] overflow-y-auto border-2 bg-white text-center">
          <div className="flex h-full flex-col justify-between gap-12 p-6 ">
            <div className="flex flex-col gap-5">
              <p className="">{t('reklamationNoification.title')}</p>
              <p className="">{t('reklamationNoification.text')}</p>
              <p>{t('reklamationNoification.secondText')}</p>
              <p className="">{t('reklamationNoification.thirdText')}</p>
              {/* This part is removed can be deleted in the future */}
              {/* <p className="">
                Der Geschenkcode ist uneingeschränkt als Zahlungsmittel für alle Produkte in
                unserem Shop anwenden.
              </p> */}
            </div>
            <div>
              <button className="bg-accent px-4 py-2" onClick={handleClose}>
                {t('reklamationNoification.buttonText')}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
