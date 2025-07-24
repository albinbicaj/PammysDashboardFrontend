import { useEffect, useState } from 'react';
import { notification } from '../../../utils/notification';
import { useNavigate } from 'react-router-dom';

function ScannerDetectorDispatch({ goBack }) {
  const navigate = useNavigate();
  const [scannedBarcode, setScannedBarcode] = useState('Nothing scanned yet');

  let barcodeScan = '';

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.keyCode === 13 && barcodeScan.length > 3) {
        handleScan(barcodeScan);
        return;
      }

      if (e.keyCode === 16) {
        return;
      }

      barcodeScan += e.key;

      setTimeout(() => {
        barcodeScan = '';
      }, 150);
    }

    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleScan = (barcode) => {
    if (barcode == 'A1B2C3D4E5') {
      goBack();
    } else {
      console.log(`Barcode "${barcode}" is not recognized!`);
    }
  };

  return null;
}

export default ScannerDetectorDispatch;
