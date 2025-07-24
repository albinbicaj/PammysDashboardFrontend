import React, { useState } from 'react';
import { IconDownload } from '@tabler/icons-react';
import axiosInstance from '../../../utils/axios';
import { PammysLoading } from '../PammysLoading/PammysLoading';

const DownloadCSVButton = ({
  text = '',
  endpoint = 'order/get-orders-csv',
  query = '',
  fileName = '',
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCSV = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${endpoint}${query}`, {
        responseType: 'blob', // Important: Ensures that the response is treated as a file (blob)
      });

      // Create a link element to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.csv`); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      console.log('File downloaded successfully');
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCSV}
      className="btn btn-secondary flex items-center gap-3"
      disabled={loading || disabled}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="whitespace-nowrap">{text}</div>
          <PammysLoading height={5} width={5} />
        </div>
      ) : (
        <>
          <span className="whitespace-nowrap">{text}</span>
          <IconDownload size={18} />
        </>
      )}
    </button>
  );
};

export default DownloadCSVButton;
