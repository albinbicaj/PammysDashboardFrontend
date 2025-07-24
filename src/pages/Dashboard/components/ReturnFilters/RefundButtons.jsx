import React from 'react';

function RefundButtons({ selectedForRefund, loading, handleManuallRefund, handleBulkRefund }) {
  return (
    <>
      <div
        onClick={selectedForRefund.length === 0 || loading ? null : handleManuallRefund}
        className={`btn ${
          selectedForRefund.length === 0 || loading ? 'btn-secondary disabled' : 'btn-primary'
        }`}
      >
        manuell erstattet
      </div>

      <div
        onClick={selectedForRefund.length === 0 || loading ? null : handleBulkRefund}
        className={`btn ${
          selectedForRefund.length === 0 || loading ? 'btn-secondary disabled' : 'btn-primary'
        }`}
      >
        Rückgabe erstatten
      </div>
    </>
  );
}

export default RefundButtons;
