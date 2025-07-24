import React, { useContext, useState } from 'react';
import { CustomButton } from '../../components/atoms';
import { Title } from '../../components/atoms';
import { ReturnForm } from '../../components/organisms';
import useDocumentTitle from '../../components/useDocumentTitle';
import { useOrderContext } from '../../context/Order.context';
import { useNavigate } from 'react-router-dom';
import { ReturnLayout } from '../../components/template/ReturnLayout';
import { LoginLayout } from '../../components/template/LoginLayout';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axiosInstance from '../../utils/axios';
import { CustomSnackBar } from '../../components/molecules';
import { PortalLayout } from '../../components/template/PortalLayout';
import { ReturnPortalLayout } from '../../components/template/ReturnPortalLayout';
import { Helmet } from 'react-helmet-async';
import { EditAddressLayout } from '../../components/template/EditAddressLayout';

const EditAddressPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <EditAddressLayout>
      <Helmet>
        <title>Pammys Retourenportal | Rücksendung & Umtausch</title>
        <meta name="title" content="Pammys Retourenportal | Rücksendung & Umtausch" />
        <meta
          name="description"
          content="Du willst deine Pammys umtauschen oder zurücksenden? Dann bist du hier genau richtig. Zum Portal."
        />
      </Helmet>
      {loading ? (
        <>
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
        </>
      ) : null}
    </EditAddressLayout>
  );
};

export default EditAddressPage;
