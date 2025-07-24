import { useDropzone } from 'react-dropzone';
import { convertFileToBase64 } from '../../../utils';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';

export const UploadRejectImages = ({ images, setImages, text, className }) => {
  const handleDelete = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 5) {
        // setOpenSnackbar(true);
        console.log("Can't upload more than 5 images");
        return;
      }
      let newImages = [...images];

      for (const file of acceptedFiles) {
        const base64Data = await convertFileToBase64(file);
        newImages.push(base64Data);
      }
      // const base64Data = await convertFileToBase64(acceptedFile[0]);
      // setImages([...images, base64Data]);

      setImages([...newImages]);
    },
    disabled: images.length >= 5, // Disable dropzone if already 5 images uploaded
    accept: 'image/jpeg, image/png',
    multiple: true, // Allow multiple file selection
    maxFiles: 5, // Maximum number of files allowed
  });

  return (
    <>
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <input {...getInputProps()} accept="image/jpeg, image/png" />
        <div className="flex flex-col items-center justify-center gap-3 py-5">
          <FileUploadIcon />
          {isDragActive ? (
            <p>Drop files here...</p>
          ) : (
            <p>Drag and drop files here, or click to select files</p>
          )}
        </div>
      </div>
      <div>
        {images.length === 0 ? (
          <div className="flex flex-col items-center">
            {/* todo make dynamic for future cases */}
            {text === 'rejectModal' ? (
              <div className="py-5">
                <p>
                  <span className="font-semibold">Fotos:</span> mindestens 3 Fotos und maximal 5
                  Fotos hinzufügen.
                </p>
                <div className="ps-3">
                  <p>1. Ein Foto muss die gesamte Rücksendung samt Karton des Kunden zeigen</p>
                  <p>2. Ein Foto muss das Rücksendelabel des Kunden zeigen</p>
                  <p>3. Mindestens 1 Foto muss von dem Produkt / Beschädigung sein.</p>
                </div>
              </div>
            ) : (
              'Fotos'
            )}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center">
            {images.map((image, index) => (
              <div
                key={index}
                className="uploaded-image-reject border-5 mx-2 my-2 flex flex-col items-center border-rose-500"
              >
                <img className="upload-image" src={image} alt={`Hochgeladenes Bild ${index + 1}`} />
                <DeleteIcon
                  className="image-icon cursor-pointer"
                  onClick={() => handleDelete(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// import { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { convertFileToBase64 } from '../../../utils';
// import FileUploadIcon from '@mui/icons-material/FileUpload';
// import DeleteIcon from '@mui/icons-material/Delete';
// export const UploadRejectImages = ({ image, setImage, text }) => {
//   const handleDelete = () => {
//     setImage('');
//   };
//   const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
//     onDrop: async (acceptedFile) => {
//       const base64Data = await convertFileToBase64(acceptedFile[0]);
//       setImage(base64Data);
//     },
//     disabled: !!image,
//     accept: 'image/jpeg, image/png',
//   });
//   return (
//     <div
//       {...getRootProps({
//         className: 'dropzone flex justify-center items-center disabled upload-product-image',
//       })}
//     >
//       <input {...getInputProps()} accept="image/jpeg, image/png" />
//       {!image ? (
//         <div className="flex flex-col items-center">
//           <div className="py-5">
//             <FileUploadIcon className="cursor-pointer " />
//           </div>
//           {/* todo make dynamic for future cases */}
//           {text === 'rejectModal' ? (
//             <div className=" py-5 ">
//               <p>
//                 <span className="font-semibold">Foto:</span> mindestens 3 Fotos hinzufügen.
//               </p>
//               <div className="ps-3">
//                 <p>1. Ein Foto muss die gesamte Rücksendung samt Karton des Kunden zeigen</p>
//                 <p>2. ein Foto muss das Rücksendelabel des Kunden zeigen</p>
//                 <p>3. mindestens 1 Foto muss von dem Produkt / Beschädigung sein.</p>
//               </div>
//             </div>
//           ) : (
//             'Foto'
//           )}
//         </div>
//       ) : (
//         <div className="uploaded-image-reject flex flex-col items-center border-5 border-rose-500">
//           <img className="upload-image" src={image} />
//           <DeleteIcon className="image-icon cursor-pointer" onClick={handleDelete} />
//         </div>
//       )}
//     </div>
//   );
// };
