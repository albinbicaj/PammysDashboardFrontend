import React, { useState } from 'react';

import { ReturnForm } from '../../components/organisms';
import { useOrderContext } from '../../context/Order.context';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axiosInstance from '../../utils/axios';
import { ReturnPortalLayout } from '../../components/template/ReturnPortalLayout';
import { Helmet } from 'react-helmet-async';
import showToast from '../../hooks/useToast';

const ReturnUploadPdfPage = () => {
  // useDocumentTitle('Pummys™ Retourenportal');
  const navigate = useNavigate(); // Get the navigate function
  const { orderContext, updateOrderContext, updateMultipleFields } = useOrderContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [orderNumberError, setOrderNumberError] = useState('');
  const setOrderNumber = (e) => {
    const inputValue = e.target.value;

    // Check if the first character is already '#'
    const updatedOrderNumber = inputValue.startsWith('#') ? inputValue : `#${inputValue}`;

    // Update the context with the updated order_number
    updateOrderContext('order_number', updatedOrderNumber);
  };

  const setEmail = (e) => {
    updateOrderContext('contact_email', e.target.value);
  };

  const fetchOrderDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await axiosInstance
      .post('/get-order', {
        email: orderContext.contact_email,
        order_number: orderContext.order_number,
      })
      .then((response) => {
        setLoading(false);
        const { data } = response;

        if (data.status_code !== 200) {
          setError(data.message);
          showToast(data.message, 'failure');
          setSuccess(false);
        } else {
          const line_items = data.order.line_items
            .filter((item) => !item.requested)
            .map((item) => ({
              ...item,
              selectedQuantity: 1,
              reasonBackend: item.reason || null,
              reason: null,
            }));

          // const requested_line_items = data.order.line_items.filter(
          //   (line_item) => line_item.requested,
          // );
          // updateOrderContext('shopify_order_id', data.order.shopify_order_id);
          // updateOrderContext('line_items', line_items);
          // updateOrderContext('shipping_address', data.order.shipping_address);
          // updateOrderContext('requested_line_items', requested_line_items);
          // updateOrderContext('products', []);
          // updateOrderContext('customer_id', data.order.customer_id);
          // updateOrderContext('payment_method', data.order.payment_method);
          updateMultipleFields({
            shopify_order_id: data.order.shopify_order_id,
            line_items: line_items,
            shipping_address: data.order.shipping_address,
            products: [],
            customer_id: data.order.customer_id,
            payment_method: data.order.payment_method,
            reklamation: data.reklamation,
            support: data.support,
          });
          setSuccess(true);
          // showToast(data.message, 'success');
          navigate('/return-order');
        }
      })
      .catch((error) => {
        setLoading(false);
        setSuccess(false);
      });
  };

  return (
    // <LoginLayout>
    <ReturnPortalLayout>
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
      ) : (
        <>
          <ReturnForm
            orderNumber={orderContext.order_number}
            setOrderNumber={setOrderNumber}
            email={orderContext.contact_email}
            setEmail={setEmail}
            fetchOrderDetails={fetchOrderDetails}
            emailError={emailError}
            orderNumberError={orderNumberError}
            setEmailError={setEmailError}
            setOrderNumberError={setOrderNumberError}
          />
        </>
      )}
    </ReturnPortalLayout>
    //</LoginLayout>
  );
};

export default ReturnUploadPdfPage;
