import React, { useState } from 'react';
import { Modal, Paper, Button } from '@mui/material';
// #rgnpcrz-todo
// in development used to zoom image on hover
// import ReactImageZoom from 'react-image-zoom';

export const UploadedImage = ({ uploaded_image }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // const props = {
  //   width: 500,
  //   height: 500,
  //   zoomWidth: 100,
  //   zoomPosition: 'original',
  //   img: 'http://localhost:8000/images/69-5-65cf9242e13d6.png',
  // };
  {
    return (
      <>
        <div
          className="uploaded-image w-50  flex cursor-pointer justify-start"
          onClick={handleOpen}
        >
          <img
            src={uploaded_image}
            alt="Bild"
            className="border-1 h-24 w-24  border object-contain"
          />
        </div>
        <Modal open={open} onClose={handleClose}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              outline: 'none',
            }}
          >
            <Paper elevation={5}>
              <img
                src={uploaded_image}
                alt="Enlarged Bild"
                className="object-contain "
                style={{ width: '600px', height: '600px' }}
              />
              {/* <ReactImageZoom {...props} /> */}
            </Paper>
            <div className="flex w-full items-center">
              <button className="close-image-modal mx-auto mt-3 px-4 py-2" onClick={handleClose}>
                schließen
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
};

// import React, { useState } from 'react';
// import { Modal, Paper, Button } from '@mui/material';

// export const UploadedImage = ({ uploaded_image }) => {
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   {
//     return open ? (
//       <div>
//         <img
//           src={uploaded_image}
//           alt="Image"
//           className="w-80 h-80 object-contain ml-2 mr-5 cursor-pointer"
//         />

//         <Modal open={open} onClose={handleClose}>
//           <div
//             style={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//             }}
//           >
//             <Paper elevation={5}>
//               <img src={uploaded_image} alt="Enlarged Image" className="w-96 h-96" />
//             </Paper>
//             <Button variant="contained" onClick={handleClose}>
//               Close
//             </Button>
//           </div>
//         </Modal>
//       </div>
//     ) : (
//       <div className="uploaded-image cursor-pointer  flex justify-start w-50" onClick={handleOpen}>
//         <img
//           src={uploaded_image}
//           alt="Image"
//           className="w-40 h-40 object-contain ml-2 mr-5 border border-1"
//         />
//       </div>
//     );
//   }
// };
