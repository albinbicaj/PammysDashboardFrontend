import { Box, Modal } from '@mui/material';
import { useModal } from '../../../context/UnhandledItemNotificationModalContext';

export const UnhandledItemNotification = ({ items = [], status = '', deleted_at = null }) => {
  const { showModal, setShowModal } = useModal();

  if (status === 'approved' || deleted_at !== null) {
    return null;
  }

  const validItems = items.filter((item) => item.deleted_at === null);
  const hasRequestedItems = validItems.some((item) => item.status === 'requested');

  if (!hasRequestedItems) {
    return null;
  }

  const handleClose = () => {
    setShowModal(false);
  };

  return showModal ? (
    <>
      <div className="mb-4 flex items-center justify-between gap-4 rounded bg-accent px-6 py-4 font-semibold drop-shadow">
        <p>Bitte bearbeiten Sie alle angeforderten Artikel! (new)</p>
        <span className="relative flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full bg-sky-500"></span>
        </span>
      </div>
      <Modal open={showModal} onClose={handleClose}>
        <Box sx={style}>
          <div className="mb-7 flex items-center justify-center">
            <div className="text-center text-2xl font-semibold leading-6 text-gray-800">
              Ungeprüfte Produkte vorhanden!
            </div>
          </div>
          <div>
            <div className="flex flex-wrap justify-center gap-5">
              {items.map((item, index) => {
                if (item.status === 'approved' || item.status === 'rejected') {
                  return null;
                }
                return (
                  <div key={`QQDFcvVk-${index}`}>
                    <img
                      src={item?.product_image}
                      alt="Bild"
                      className="border-1 h-24 w-24 border object-contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-10 flex items-center justify-around">
            <div>
              <button className="btn btn-primary" onClick={handleClose}>
                Fortfahren
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  ) : null;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 570,
  minHeight: 160,
  bgcolor: '#fff',
  p: 4,
  borderRadius: '6px',
  border: '1px solid #000',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
};

// # FIRST VERISON
// # WITHOYT DELETE === NULL filter
//
// export const UnhandledItemNotification = ({ items = [], status = '' }) => {
//   // if status is approved return null (save CPU power)
//   if (status === 'approved') {
//     return null;
//   }

//   const showNotification =
//     items.length > 1 &&
//     items.some((item) => item.status === 'approved') &&
//     items.some((item) => item.status === 'requested');

//   console.log('showNotification', showNotification);

//   // Render the notification if criteria are met
//   return showNotification ? (
//     <div className="mb-4 flex items-center justify-between gap-4 rounded bg-accent px-6 py-4 font-semibold drop-shadow">
//       <p>Bitte bearbeiten Sie alle angeforderten Artikel! (new)</p>
//       <span className="relative flex h-4 w-4">
//         <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
//         <span className="relative inline-flex h-4 w-4 rounded-full bg-sky-500"></span>
//       </span>
//     </div>
//   ) : null;
// };
