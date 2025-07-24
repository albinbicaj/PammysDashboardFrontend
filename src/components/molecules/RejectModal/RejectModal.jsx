import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { UploadRejectImages } from '../UploadRejectImages/UploadRejectImages';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 620,
  bgcolor: '#fff',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export const RejectModal = ({
  showModal,
  setShowModal,
  setComment,
  comment,
  images,
  setImages,
  handleRejectOrder,
  message,
  setMessage,
  errorMessage,
  setErrorMessage,
  reasonNumber,
  setReklamation,
  returnChecked,
  rejectButtonLoading,
  handleReject,
}) => {
  console.log('reasonNumber', reasonNumber);
  console.log('rejectMessage', message);
  // comment = rejectComment is the reason
  // message = rejectMessage is the textbox
  const handleCommentChange = (e) => {
    if (e.target.value !== '') {
      setErrorMessage('');
    }
    setComment(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    console.log('Message', e.target.value);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleImageChange = (file) => {
    setImages(file);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(156, 163, 175, 0.75)', // bg-gray-400 with 75% opacity
          },
        }}
      >
        <Box sx={style}>
          {(reasonNumber == 5 || reasonNumber == 7) && returnChecked === null ? (
            <div>
              {setComment('sonstiges')}
              {setReklamation(true)}
              <p className="modal-title" id="modal-modal-title">
                Teile dem Kunden mit, warum die Anfrage abgelehnt wird.
              </p>

              <div className="mb-4 flex">
                <div className="w-[100%] flex-col">
                  <textarea
                    onChange={handleMessageChange}
                    value={message}
                    className={
                      'mt-6 h-48 w-full resize-y border p-2 ' +
                      (errorMessage === '' ? '' : 'border-red-500')
                    }
                    placeholder="Kommentar hinterlassen... ..."
                  />
                  <p className="text-red-500">{errorMessage}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="modal-title text-center text-xl font-bold" id="modal-modal-title">
                Rücksendung ablehnen
              </p>
              <UploadRejectImages
                className="mt-5 flex h-32 cursor-pointer items-center justify-center border"
                images={images}
                setImages={setImages}
                text="rejectModal"
              />
              <div className="mb-2 mt-4">
                <label htmlFor="reject-reason">Grund:</label>
                <select
                  value={comment}
                  onChange={handleCommentChange}
                  className={
                    'mb-4 h-10 w-full cursor-pointer border-2 ' +
                    (errorMessage === '' ? '' : 'border-red-500')
                  }
                  id="reject-reason"
                >
                  <option value="">-</option>
                  <option value="beschädigt">beschädigt</option>
                  <option value="getragen">getragen</option>
                  {/* <option value="falscher Artikel">falscher Artikel</option> */}
                  <option value="fremder Artikel">fremder Artikel</option>
                  {/* <option value="Anzahl nicht richtig - zu wenige">
                    Anzahl nicht richtig - zu wenige
                  </option>
                  <option value="Anzahl nicht richtig - zu viele">
                    Anzahl nicht richtig - zu viele
                  </option> */}
                  <option value="Rückgabefrist überschritten">Rückgabefrist überschritten</option>
                  <option value="sonstiges">sonstiges</option>
                </select>
              </div>
              {comment === 'sonstiges' && (
                <div className="mb-4 flex">
                  <textarea
                    onChange={handleMessageChange}
                    value={message}
                    className={
                      'h-48 w-full resize-y border p-2 ' +
                      (errorMessage === '' ? '' : 'border-red-500')
                    }
                    placeholder="Kommentar hinterlassen ..."
                  />
                </div>
              )}
            </div>
          )}
          <div className="mt-5 flex items-center justify-center gap-5">
            <button className="border px-4 py-2" onClick={handleClose}>
              abbrechen
            </button>

            {rejectButtonLoading ? (
              <button
                className="cursor-pointer bg-danger px-4 py-2 text-white"
                onClick={() => {
                  (reasonNumber == 5 || reasonNumber == 7) && returnChecked === null
                    ? handleRejectOrder()
                    : handleReject();
                }}
              >
                <div className="flex gap-2">
                  <PammysLoading height={5} width={5} />
                  <div>ablehnen</div>
                </div>
              </button>
            ) : (
              <button
                className="cursor-pointer bg-danger px-4 py-2 text-white"
                onClick={() => {
                  (reasonNumber == 5 || reasonNumber == 7) && returnChecked === null
                    ? handleRejectOrder()
                    : handleReject();
                }}
              >
                ablehnen
              </button>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};
