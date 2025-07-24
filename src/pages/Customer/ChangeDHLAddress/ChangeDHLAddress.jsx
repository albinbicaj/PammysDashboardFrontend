import { CustomerLayout } from '../../../components/template/CustomerLayout';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PammysLoading } from '../../../components/atoms/PammysLoading/PammysLoading';
import axiosInstance from '../../../utils/axios';
import { useEffect, useState } from 'react';
import { CO2Footer } from '../../../components/atoms/CO2Footer';
import AddressForm from './components/AddressForm';
import { IconCircleCheckFilled, IconX } from '@tabler/icons-react';
import { Box, Modal } from '@mui/material';
import showToast from '../../../hooks/useToast';

const initialFormState = {
  first_name: '',
  last_name: '',
  address1: '',
  //   address2: '',
  zip: '',
  city: '',
  country: '',
  country_code: '',
  order_shopify_id: '',
  phone: '',
  company: '',
  // warning: false,
};

const fetchOrderStatus = async (orderName, customerEmail, token) => {
  const response = await axiosInstance.get(
    `/order/order-name?order_name=${encodeURIComponent(orderName)}&costumer_email=${encodeURIComponent(customerEmail)}&token=${encodeURIComponent(token)}`,
  );
  return response.data;
};

const ChangeDHLAddress = () => {
  const [searchParams] = useSearchParams();
  const [address, setAddress] = useState(initialFormState);
  const [requestingDHL, setRequestingDHL] = useState(false);
  const [orderStatusCode, setOrderStatusCode] = useState(0);
  const [dhlUpdateStatus, setDhlUpdateStatus] = useState(0);
  const [warning, setWarning] = useState(false);
  const [notification, setNotification] = useState(false);

  const orderName = searchParams.get('order_name');
  const customerEmail = searchParams.get('costumer_email');
  const token = searchParams.get('token');

  const { isLoading, error, data } = useQuery({
    queryKey: ['dhlOrderStatus', orderName, customerEmail, token],
    queryFn: () => fetchOrderStatus(orderName, customerEmail, token),
    refetchOnWindowFocus: false,
    // enabled: !!orderName && !!customerEmail && !!token, // Prevent fetching if any parameter is missing
  });

  const handleSubmit = async (e = null, warning = false) => {
    if (e) e.preventDefault(); // Only prevent default if an event is provided
    console.log('Updated form');
    console.log(address);
    // Add form validation and submission logic here
    setRequestingDHL(true);
    try {
      // Create a new data object with address and token
      const postData = {
        ...address,
        token, // Include the token in the data to be sent
        warning: warning,
      };

      // Make the POST request to the update endpoint
      const response = await axiosInstance.post(
        '/order/customer-update-shipping-address',
        postData,
      );

      console.log(response);

      // Handle successful response
      if (response?.data?.status_code === 200) {
        setDhlUpdateStatus(response?.data?.status_code);
        showToast('Die Bestelladresse wurde erfolgreich aktualisiert.', 'success');
        console.log('Address updated successfully.');
        // setSuccessMessage('Address updated successfully.');
      } else {
        setDhlUpdateStatus(response?.data?.status_code);

        if (
          typeof response?.data?.message === 'string' &&
          response.data.message.toLowerCase().includes('warning')
        ) {
          setNotification(true);
          console.log('warning is included');
          return;
        }

        showToast(response.data.message, 'failure');
        console.log(`Error: ${response?.data?.message}`);
        // setErrorMessage(`Error: ${response.status}`);
      }
    } catch (error) {
      // Handle errors from the request
      console.log(error.response?.data?.message || 'Something went wrong.');
      //   setErrorMessage(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setRequestingDHL(false);
    }
  };

  // Update the address state when data is fetched successfully
  useEffect(() => {
    if (data) {
      console.log(data);
      setOrderStatusCode(data.status_code);
      if (data.status_code === 200) {
        setAddress({
          first_name: data.order.shipping_address_first_name || '',
          last_name: data.order.shipping_address_last_name || '',
          address1: data.order.shipping_address_address1 || '',
          // address2: data.order.shipping_address_address2 || '',
          zip: data.order.shipping_address_zip || '',
          city: data.order.shipping_address_city || '',
          country: data.order.shipping_address_country || '',
          country_code: data.order.shipping_address_country_code || '',
          order_shopify_id: data.order.shopify_order_id || '',
          phone: data.order.shipping_address_phone || '',
        });
      }
    }
  }, [data]);

  if (isLoading === true) {
    <PammysLoading />;
  }
  if (error) {
    <>
      <p>Etwas ist schief gelaufen.</p>
      <p>Bitte versuchen Sie es später noch einmal.</p>
    </>;
  }

  return (
    <CustomerLayout>
      <div className={`flex items-center justify-between gap-3 border-b bg-white px-4 lg:px-6`}>
        <p className=" text-right text-base font-bold md:text-xl">Lieferadresse bearbeiten</p>
        <img
          className="my-4 max-w-20 bg-cover md:max-w-24"
          src="/images/new/logo-new.svg"
          alt="Pammy's Logo."
        />
      </div>

      <Modal
        className="text-center"
        open={notification}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(156, 163, 175, 0.75)', // bg-gray-400 with 75% opacity
          },
        }}
      >
        <Box className="custom-modal max-h-[80%] min-w-[350px]  max-w-[450px] overflow-y-auto bg-white text-center ">
          <div className="flex h-full flex-col justify-between gap-10 p-4">
            <p className=" pt-4 text-2xl font-medium">Wichtiger Hinweis!</p>
            <div className="space-y-3">
              <p>
                Ich bestätige, dass die von mir angegebene Adresse korrekt ist. Sollte die Adresse
                von DHL nicht akzeptiert werden, wird die Sendung dennoch mit diesen Angaben
                versendet.
              </p>

              <p>
                Ich übernehme die Kosten für den Versand und die Rücksendung, falls die Lieferung
                aufgrund einer fehlerhaften Adresse nicht zugestellt werden kann.
              </p>
            </div>

            <div className="flex flex-col items-start justify-between gap-3">
              <button
                onClick={() => {
                  setNotification(false);
                }}
                className="w-full  bg-accent px-4 py-3 font-semibold"
              >
                <span>erneut versuchen</span>
              </button>
              <button
                onClick={() => {
                  setWarning(true), setNotification(false), handleSubmit(null, true);
                }}
                className="w-full bg-accent-50 px-4 py-2 text-center"
              >
                <span>bestätigen</span>
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      <div className={`flex h-12 items-center justify-between border-b bg-white px-4 lg:px-6`}>
        <p className=" ">{orderName}</p>
        <p className=" ">{customerEmail}</p>
      </div>
      <div className=" min-h-[450px] overflow-y-auto bg-white ">
        {isLoading === true ? (
          <div className="h-[400px]">
            <PammysLoading />
          </div>
        ) : orderStatusCode === 404 ? (
          <div className="flex h-[400px] flex-col items-center justify-center gap-4  p-4 text-center">
            <IconCircleCheckFilled className="text-success" size={45} />
            <p>Die Adresse für diese Bestellung ist korrekt.</p>
          </div>
        ) : (
          <AddressForm
            handleSubmit={handleSubmit}
            address={address}
            setAddress={setAddress}
            requestingDHL={requestingDHL}
            dhlUpdateStatus={dhlUpdateStatus}
            warning={warning}
          />
        )}
      </div>

      <CO2Footer />
    </CustomerLayout>
  );
};

export default ChangeDHLAddress;
