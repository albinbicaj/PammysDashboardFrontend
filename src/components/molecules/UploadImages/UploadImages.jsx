import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { convertFileToBase64 } from '../../../utils';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
export const UploadImages = ({ image, setImage, text }) => {
  const handleDelete = () => {
    setImage('');
  };
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFile) => {
      const base64Data = await convertFileToBase64(acceptedFile[0]);
      setImage(base64Data);
    },
    disabled: !!image,
    accept: 'image/jpeg, image/png',
  });
  return (
    <div
      {...getRootProps({
        className: 'dropzone flex justify-center items-center disabled upload-product-image',
      })}
    >
      <input {...getInputProps()} accept="image/jpeg, image/png" />
      {!image ? (
        <div className="flex flex-col items-center">
          <div className="py-5">
            <FileUploadIcon className="cursor-pointer " />
          </div>
          {/* todo make dynamic for future cases */}
          {text === 'rejectModal' ? (
            <div className=" py-5 ">
              <p>
                <span className="font-semibold">Foto:</span> mindestens 3 Fotos hinzufügen.
              </p>
              <div className="ps-3">
                <p>1. Ein Foto muss die gesamte Rücksendung samt Karton des Kunden zeigen</p>
                <p>2. ein Foto muss das Rücksendelabel des Kunden zeigen</p>
                <p>3. mindestens 1 Foto muss von dem Produkt / Beschädigung sein.</p>
              </div>
            </div>
          ) : (
            'Foto'
          )}
        </div>
      ) : (
        <div className="uploaded-image-reject flex flex-col items-center border-5 border-rose-500">
          <img className="upload-image" src={image} />
          <DeleteIcon className="image-icon cursor-pointer" onClick={handleDelete} />
        </div>
      )}
    </div>
  );
};
