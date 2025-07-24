import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useOrderContext } from '../../../context/Order.context';
import { ReasonEnum } from '../../../enums/Reason.enum';
import { useTranslation } from 'react-i18next';
// import { file } from 'jszip';
import { IconUpload, IconX } from '@tabler/icons-react';
import { Tooltip } from '@mui/material';
import showToast from '../../../hooks/useToast';

export const UploadField = ({ product_id }) => {
  const { orderContext, toggleImageForReturn } = useOrderContext();
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const maxFiles = 5;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const lineItem = orderContext.line_items.find((item) => item.id === product_id);
  const { t } = useTranslation();

  const handleImageSelect = (images, imageData) => {
    toggleImageForReturn(product_id, images, imageData);
  };

  const handleFileDelete = (imageIndex) => {
    const updatedImages = [...lineItem.image];
    const updatedImagesData = [...lineItem.imageData];
    updatedImages.splice(imageIndex, 1);
    updatedImagesData.splice(imageIndex, 1);
    handleImageSelect(updatedImages, updatedImagesData);
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
  const { acceptedFiles, fileRejections, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles, fileRejections) => {
      setRejectedFiles(fileRejections);
      // # todo show notification if more than 5 files uploaded
      // duhet me e marr parasysh edhe lineItem.image.length acceptedFiles osht per single upload
      // me i upload perniher qaq files

      if (acceptedFiles.length + (lineItem?.image?.length || 0) > maxFiles) {
        showToast(t('uploadField.' + 'alertText'), 'success');
        setOpenSnackbar(true);
        return;
      }

      let newImages = [];
      let currentAcceptedImages = [];

      if (lineItem.image && Array.isArray(lineItem.image)) {
        newImages = [...lineItem.image];
      }
      if (lineItem.imageData && Array.isArray(lineItem.imageData)) {
        currentAcceptedImages = lineItem.imageData.map((imageData) => ({ ...imageData }));
      }
      //  acceptedFiles.slice(0, 5) if i set slice (0 ,4) when I upload 5 images, 4 appear
      for (const file of acceptedFiles.slice(0, 5)) {
        const base64Data = await convertFileToBase64(file);
        newImages.push(base64Data);
        currentAcceptedImages.push(file);
      }

      handleImageSelect(newImages, currentAcceptedImages);
    },
    accept: {
      // 'image/*': [],
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
      'image/webp': ['.webp'],
    },
    multiple: true, // Allow multiple files to be dropped
    maxFiles: 5,
    maxSize: 5242880, // Max 5MB file
  });

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

          {/* {!!lineItem.image && !!lineItem.image.length && (
            <div className="flex flex-wrap gap-x-8">
              {lineItem.image.map((image, index) => (
                <div key={index} className="group relative">
                  <img className="aspect-square w-28  object-contain" src={image} alt="Uploaded" />
                  <div className="absolute inset-x-0 bottom-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50 opacity-100">
                    <DeleteIcon className="text-white" onClick={() => handleFileDelete(index)} />
                  </div>
                </div>
              ))}
            </div>
          )} */}
          {!!lineItem.imageData && !!lineItem.imageData.length && (
            <div className="grid grid-cols-4 gap-4">
              {lineItem.imageData.map((image, index) => (
                <div className="relative flex flex-col items-center" key={index}>
                  <div key={index} className="group relative bg-white">
                    <img
                      className="aspect-square  border object-contain"
                      src={lineItem.image[index]}
                      alt="Uploaded"
                    />
                  </div>
                  <Tooltip title={image.path} className="cursor-pointer" arrow>
                    <p className="w-full overflow-hidden truncate ">{image.path}</p>
                  </Tooltip>
                  <div className=" absolute right-0 top-0 m-1 rounded-md bg-black bg-opacity-50 p-0.5">
                    <IconX
                      size={18}
                      className=" cursor-pointer  text-white"
                      onClick={() => handleFileDelete(index)}
                    />
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
              <IconUpload />
            </div>
          </div>
          {rejectedFiles.length > 0 && (
            <div>
              <p className="font-bold text-red-500">Rejected Files</p>
              <ul>
                {rejectedFiles.map((item, index) => (
                  <li>{item.file.name}</li>
                ))}
              </ul>
              <p className="font-bold text-red-500">Rejected Files</p>
            </div>
          )}

          {/* <div className="my-div">
            {(!lineItem.image || lineItem?.image?.length < 5) && (
              <div className="higher images-container flex items-center justify-center">
                <p className="upload-text">
                  Fotos hochladen <FileUploadIcon />
                </p>
              </div>
            )}
          </div> */}
        </div>
      </section>
    </>
  );
};
