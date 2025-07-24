import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useOrderContext } from '../../../context/Order.context';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { ReasonEnum } from '../../../enums/Reason.enum';
import UploadIcon from '../../atoms/UploadIcon/UploadIcon';
import { useTranslation } from 'react-i18next';

export const UploadField = ({ product_id }) => {
  const { orderContext, toggleImageForReturn } = useOrderContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const lineItem = orderContext.line_items.find((item) => item.id === product_id);
  const { t } = useTranslation();

  const handleImageSelect = (images) => {
    toggleImageForReturn(product_id, images);
  };

  const handleFileDelete = (imageIndex) => {
    const updatedImages = [...lineItem.image];
    updatedImages.splice(imageIndex, 1);
    handleImageSelect(updatedImages);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      // # todo show notification if more than 5 files uploaded
      // duhet me e marr parasysh edhe lineItem.image.length acceptedFiles osht per single upload
      // me i upload perniher qaq files

      if (acceptedFiles.length > 5) {
        setOpenSnackbar(true);
        return;
      }

      let newImages = [];

      if (lineItem.image && Array.isArray(lineItem.image)) {
        newImages = [...lineItem.image];
      }
      //  acceptedFiles.slice(0, 5) if i set slice (0 ,4) when I upload 5 images, 4 appear
      for (const file of acceptedFiles.slice(0, 5)) {
        const base64Data = await convertFileToBase64(file);
        newImages.push(base64Data);
      }

      handleImageSelect(newImages);
    },
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
    multiple: true, // Allow multiple files to be dropped
    maxFiles: 5,
  });

  useEffect(() => {}, [acceptedFiles]);
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <>
      <section className="upload-container mt-5 flex w-full flex-col  items-center justify-center bg-secondary p-3">
        <div className="flex w-full flex-col gap-5">
          {/* {(!lineItem.image || lineItem.image.length === 0) && ( */}

          <p className=" ">
            {lineItem?.reason == ReasonEnum.MISDELIVERY ? (
              <>
                <span className="mr-1 p-0 font-bold text-black">
                  {t('uploadField.' + 'misDeliveryBoldText')}
                </span>
                {t('uploadField.' + 'text')}
              </>
            ) : (
              <>
                <span className="mr-1 p-0 font-bold text-black">
                  {t('uploadField.' + 'boldText')}
                </span>
                {t('uploadField.' + 'text')}
              </>
            )}
          </p>
          {!!lineItem.image && !!lineItem.image.length && (
            <div className="flex flex-wrap gap-x-8">
              {lineItem.image.map((image, index) => (
                <div key={index} className="group relative">
                  <img className="aspect-square w-28  object-contain" src={image} alt="Uploaded" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 opacity-100">
                    <DeleteIcon className="text-white" onClick={() => handleFileDelete(index)} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            className=""
            {...getRootProps({
              className:
                'w-full flex h-20 cursor-pointer items-center justify-center border outline-dashed',
            })}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2 py-5">
              {isDragActive ? (
                <p>{t('uploadField.' + 'dropFilesText')}</p>
              ) : (
                <p>{t('uploadField.' + 'dragDropFilesText')}</p>
              )}
              <UploadIcon />
            </div>
          </div>
          {/* <div>{files}</div> */}

          {/* <div className="my-div">
            {(!lineItem.image || lineItem?.image?.length < 5) && (
              <div className="higher images-container flex items-center justify-center">
                <p className="upload-text">
                  Fotos hochladen <FileUploadIcon />
                </p>
              </div>
            )}
          </div> */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MuiAlert onClose={handleCloseSnackbar} severity="error">
              {t('uploadField.' + 'alertText')}
            </MuiAlert>
          </Snackbar>
        </div>
      </section>
    </>
  );
};
