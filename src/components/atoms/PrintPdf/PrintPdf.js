import React from 'react';

const PrintPdf = ({ pdfUrl }) => {
  const handlePrint = () => {
    // Open a new window or tab with the PDF URL
    const newTab = window.open(pdfUrl, '_blank');

    // After the new tab has loaded, trigger the print function
    newTab.onload = () => {
      newTab.print();
    };
  };

  return (
    <div>
      <button onClick={handlePrint}>Print PDF</button>
      {/* Hidden iframe to load the PDF */}
      <iframe src={pdfUrl} title="PDF" style={{ display: 'none' }} />
    </div>
  );
};

export default PrintPdf;
