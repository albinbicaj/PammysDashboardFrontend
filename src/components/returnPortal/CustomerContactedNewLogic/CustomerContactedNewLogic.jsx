import { StatusEnum } from '../../../enums/Status.enum';
import CheckIcon from '@mui/icons-material/Check';
import axiosInstance from '../../../utils/axios';
import { IconCheck } from '@tabler/icons-react';

const handleResolveDispute = async ({ id = '', refetch = () => {} }) => {
  try {
    const response = await axiosInstance.post('/return/resolve-dispute', {
      id: id,
    });
    if (response.data.status_code !== 200) {
      console.log('Something went wrong');
    } else {
      refetch();
    }
  } catch (error) {
    console.error(error);
  }
};

const handleConfirmReturn = async ({ id = '', refetch = () => {} }) => {
  try {
    const response = await axiosInstance.post('/return/sent-back-to-customer', {
      id: id,
    });
    if (response.data.status_code !== 200) {
      console.log('Something went wrong');
    } else {
      refetch();
    }
  } catch (error) {
    console.error(error);
  }
};

const handleDonate = async ({ id = '', refetch = () => {} }) => {
  try {
    const response = await axiosInstance.post('/return/donate-rejected-order', {
      id: id,
    });
    if (response.data.status_code !== 200) {
      console.log('Something went wrong');
    } else {
      refetch();
    }
  } catch (error) {
    console.error(error);
  }
};

export const CustomerContactedNewLogic = ({ order_details = [], refetch = () => {} }) => {
  const clientDidntUploadLabel = order_details?.items?.some(
    (item) => item.email_status === 'return_label_not_uploaded',
  );

  return (
    <div>
      {/* {order_details?.notifications === 'customer_contacted' ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="btn rounded-sm bg-gray-400 text-white"
            onClick={() => {
              console.log('Button is disabled');
            }}
          >
            An Kunden senden
          </button>
          <button
            type="button"
            className="btn rounded-sm bg-gray-400 text-white"
            onClick={() => {
              console.log('Button is disabled');
            }}
          >
            Spendet
          </button>
        </div>
      ) : null}
      {order_details?.notifications === 'to_edit' ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={clientDidntUploadLabel}
            className={`btn rounded-sm ${!clientDidntUploadLabel ? 'bg-accent' : 'bg-gray-400'}  text-white`}
            onClick={() => {
              handleConfirmReturn({ id: order_details?.id, refetch });
            }}
          >
            An Kunden senden
          </button>
          <button
            type="button"
            disabled={!clientDidntUploadLabel}
            className={`btn rounded-sm ${clientDidntUploadLabel ? 'bg-accent' : 'bg-gray-400'}  text-white`}
            onClick={() => {
              handleDonate({ id: order_details?.id, refetch });
            }}
          >
            Spendet
          </button>
        </div>
      ) : null}
      {order_details?.notifications === 'sent_back_to_customer' ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="btn rounded-sm bg-gray-400 text-white"
            onClick={() => {
              console.log('Sent back to customer');
            }}
          >
            An Kunden zurückgesendet
          </button>
          <button
            type="button"
            className="btn rounded-sm bg-gray-400 text-white"
            onClick={() => {
              console.log('Donated');
            }}
          >
            Spendet
          </button>
        </div>
      ) : null}
      {order_details?.notifications === 'donated' ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="btn rounded-sm bg-gray-400 text-white"
            onClick={() => {
              console.log('Sent back to customer');
            }}
          >
            An Kunden senden
          </button>
          <button
            type="button"
            className="btn rounded-sm bg-gray-400 text-white"
            onClick={() => {
              console.log('Donated');
            }}
          >
            Gespendet
          </button>
        </div>
      ) : null} */}
    </div>
  );
};
