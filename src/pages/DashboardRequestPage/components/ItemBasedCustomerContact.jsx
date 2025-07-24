import axiosInstance from '../../../utils/axios';

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

export const ItemBasedCustomerContact = ({
  itemId = '',
  orderNotification = null,
  clientDidntUploadLabel,
  itemCurrentStatus = '',
  supportStatusItem,
  returnCheckedItem,
  reasonNumber,
  refetch = () => {},
}) => {
  return (
    <div
      className={
        orderNotification === 'customer_contacted' &&
        itemCurrentStatus !== 'approved' &&
        orderNotification === 'sent_back_to_customer' &&
        orderNotification === 'donated' &&
        itemCurrentStatus !== 'approved' &&
        supportStatusItem !== 'rejected' &&
        returnCheckedItem
          ? 'mb-5 min-h-12'
          : ''
      }
    >
      {orderNotification === 'customer_contacted' &&
      itemCurrentStatus !== 'approved' &&
      itemCurrentStatus !== 'refunded' &&
      ((supportStatusItem !== 'rejected' && !returnCheckedItem) ||
        !(reasonNumber === 5 || reasonNumber === 7)) ? (
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
      {/* {orderNotification === 'to_edit' ? (
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
      ) : null} */}
      {orderNotification === 'to_edit' && itemCurrentStatus !== 'approved' ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={clientDidntUploadLabel || itemCurrentStatus === 'returned'}
            className={`btn rounded-sm ${!clientDidntUploadLabel ? 'bg-accent' : 'bg-gray-400'}  text-white`}
            onClick={() => {
              handleConfirmReturn({ id: itemId, refetch });
            }}
          >
            {itemCurrentStatus === 'returned' ? 'An Kunden zurückgesendet' : 'An Kunden senden'}
          </button>
          <button
            type="button"
            disabled={!clientDidntUploadLabel || itemCurrentStatus === 'donated'}
            className={`btn rounded-sm ${clientDidntUploadLabel ? 'bg-accent' : 'bg-gray-400'}  text-white`}
            onClick={() => {
              handleDonate({ id: itemId, refetch });
            }}
          >
            {itemCurrentStatus === 'donated' ? 'Gespendet' : 'Spenden'}
          </button>
        </div>
      ) : null}
      {(orderNotification === 'sent_back_to_customer' || orderNotification === 'donated') &&
      itemCurrentStatus !== 'approved' ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="btn rounded-sm bg-gray-400 text-white"
            onClick={() => {
              console.log('Sent back to customer');
            }}
          >
            {itemCurrentStatus === 'returned' ? 'An Kunden zurückgesendet' : 'An Kunden senden'}
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
      ) : null}
    </div>
  );
};
