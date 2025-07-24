import React from 'react';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';

const ViewEmailButton = ({ log, handleViewEmail, loading }) => {
  return (
    <div>
      {log?.isEmailLog && (
        <button
          onClick={() => handleViewEmail(log.email_status, log.id)}
          className="whitespace-nowrap border px-4 py-2 text-base font-normal"
        >
          {loading[log.id] ? <PammysLoading height={5} width={5} /> : 'View Email'}
        </button>
      )}
    </div>
  );
};

export default ViewEmailButton;
