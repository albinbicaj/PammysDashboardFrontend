import { useState } from 'react';
import { ONE_ORDER_RULE_ID } from '../../../config/env';
import axiosInstance from '../../../utils/axios';
import { downloadBase64PDF } from '../../../utils/pdf';

export const SingleOrderPicklistButton = ({ orderNumber = '#' }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/picklist/create-picklist-singel-order`, {
        order_name: orderNumber,
        rule_id: ONE_ORDER_RULE_ID,
      });
      if (response.data.status === 200) {
        console.log(response.data.pdf[0]);
        downloadBase64PDF(response.data.pdf[0], `Pick_List_${orderNumber}`);
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log('ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button disabled={loading} className="btn btn-secondary" onClick={handleClick}>
      Generate Singe Order Picklist {orderNumber}
    </button>
  );
};
