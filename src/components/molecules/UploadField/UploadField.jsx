import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useOrderContext } from '../../../context/Order.context';
import { ReasonEnum } from '../../../enums/Reason.enum';
import { useTranslation } from 'react-i18next';
import { IconUpload, IconX } from '@tabler/icons-react';
import { Tooltip } from '@mui/material';
import showToast from '../../../hooks/useToast';
import imageCompression from 'browser-image-compression';

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
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: (file.size * 0.7) / (1024 * 1024),
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      console.log(`Original file name: ${file.name}`);
      console.log(`Original file size: ${file.size / 1024 / 1024} MB`);

      const compressedFile = await imageCompression(file, options);

      console.log(`Compressed file size: ${compressedFile.size / 1024 / 1024} MB`);

      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
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

      if (acceptedFiles.length + (lineItem?.image?.length || 0) > maxFiles) {
        showToast(t('uploadField.alertText'), 'success');
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

      for (const file of acceptedFiles.slice(0, 5)) {
        const compressedFile = await compressImage(file);
        const base64Data = await convertFileToBase64(compressedFile);
        newImages.push(base64Data);
        currentAcceptedImages.push(compressedFile);
      }

      handleImageSelect(newImages, currentAcceptedImages);
    },
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
      'image/webp': ['.webp'],
    },
    multiple: true,
    maxFiles: 5,
    maxSize: 5242880, // Max 5MB file
  });

  return (
    <>
      <section className="upload-container mt-5 flex w-full flex-col items-center justify-center bg-secondary p-3">
        <div className="flex w-full flex-col gap-5">
          <p className="">
            {lineItem?.reason == ReasonEnum.MISDELIVERY ? (
              <>
                <span className="mr-1 p-0 font-bold text-black">
                  {t('uploadField.misDeliveryBoldText')}
                </span>
                {t('uploadField.text')}
              </>
            ) : (
              <>
                <span className="mr-1 p-0 font-bold text-black">{t('uploadField.boldText')}</span>
                {t('uploadField.text')}
              </>
            )}
          </p>

          {!!lineItem.imageData && !!lineItem.imageData.length && (
            <div className="grid grid-cols-4 gap-4">
              {lineItem.imageData.map((image, index) => (
                <div className="relative flex flex-col items-center" key={index}>
                  <div key={index} className="group relative bg-white">
                    <img
                      className="aspect-square border object-contain"
                      src={lineItem.image[index]}
                      alt="Uploaded"
                    />
                  </div>
                  <Tooltip title={image.path} className="cursor-pointer" arrow>
                    <p className="w-full overflow-hidden truncate">{image.name}</p>
                  </Tooltip>
                  <div className="absolute right-0 top-0 m-1 rounded-md bg-black bg-opacity-50 p-0.5">
                    <IconX
                      size={18}
                      className="cursor-pointer text-white"
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
                <p>{t('uploadField.dropFilesText')}</p>
              ) : (
                <p>{t('uploadField.dragDropFilesText')}</p>
              )}
              <IconUpload />
            </div>
          </div>

          {rejectedFiles.length > 0 && (
            <div>
              <p className="font-bold text-red-500">Rejected Files</p>
              <ul>
                {rejectedFiles.map((item, index) => (
                  <li key={index}>{item.file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
