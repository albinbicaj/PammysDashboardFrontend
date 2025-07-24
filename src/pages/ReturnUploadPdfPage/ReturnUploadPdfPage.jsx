import React, { useContext, useEffect, useState } from 'react';
import { CustomButton } from '../../components/atoms';
import { Title } from '../../components/atoms';
import { ReturnForm } from '../../components/organisms';
import useDocumentTitle from '../../components/useDocumentTitle';
import { useOrderContext } from '../../context/Order.context';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReturnLayout } from '../../components/template/ReturnLayout';
import { LoginLayout } from '../../components/template/LoginLayout';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axiosInstance from '../../utils/axios';
import { CustomSnackBar } from '../../components/molecules';
import { UploadPdf } from '../../components/molecules/UploadPdf/UploadPdf';
import queryString from 'query-string';
import axios from 'axios';
import { ReturnPortalLayout } from '../../components/template/ReturnPortalLayout';

const ReturnOrdersPage = () => {
  useDocumentTitle('Pammys™ Upload PDF ');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate(); // Get the navigate function
  const { orderContext, updateOrderContext } = useOrderContext();
  const parsed = queryString.parse(location.search);

  const parsedRequestedId = parsed.requested_id || '';
  const parsedRequestedItemId = parsed.requested_item_id || '';
  const parsedLabel = parsed.label || '';

  const [pdf, setPdf] = useState('');

  const handleSubmitPdf = async () => {
    setLoading(true);
    const res = await axiosInstance
      .post('/dashboard/upload-return-label', {
        requested_id: parsedRequestedId,
        requested_item_id: parsedRequestedItemId,
        unique_id: parsedLabel,
        return_label: pdf,
      })
      .then((response) => {
        setLoading(false);
        const { data } = response;
        console.log(response);

        if (response.data.status_code === 200) {
          console.log('PDF Uploaded succesfully');
          console.log(response);
          setSuccess(true);
        } else {
          console.log(response);
          setError(response.message);
          setSuccess(false);
        }
      })
      .catch((error) => {
        console.error('Error in axiosInstance.post:', error);
        setLoading(false);
        setSuccess(false);
      });
    console.log('is this working');
  };

  return (
    <ReturnPortalLayout>
      <div className="flex h-full flex-col items-center">
        {loading ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : success ? (
          <>
            <p className="mt-36 pt-5">PDF-Datei erfolgreich hochgeladen</p>
          </>
        ) : (
          <>
            <p className="pt-5">PDF-DATEI HOCHLADEN</p>
            <p className="text-sm">max 1 pdf</p>
            <div className="flex h-48 items-center">
              <UploadPdf file={pdf} setFile={setPdf} />
            </div>
            <button
              className={`start-button ${pdf === '' ? 'disabled' : ''}`}
              disabled={pdf === ''}
              onClick={handleSubmitPdf}
            >
              {pdf === '' ? 'bitte eine PDF-Datei hochladen' : 'PDF-Datei senden'}
            </button>
          </>
        )}
      </div>
    </ReturnPortalLayout>
  );
};

export default ReturnOrdersPage;
