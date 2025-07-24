import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import showToast from '../../../hooks/useToast';

function ScannerDetector() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scannedBarcode, setScannedBarcode] = useState('Nothing scanned yet');

  let barcodeScan = '';

  useEffect(() => {
    if (location.pathname.startsWith('/dashboard/dispatch-center')) {
      return;
    }

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
  }, [location.pathname]); // Add location.pathname to the dependency array

  const handleScan = (barcode) => {
    if (barcode.match(/^[A-Za-z]{3}-\d{6,9}$/)) {
      showToast(`Pammys ID: ${barcode}`, 'success');
      navigate(`/dashboard/order?return_id=` + encodeURIComponent(barcode), {
        // replace: true,
      });
    } else if (barcode.match(/^(\(Y\))?12\d{6,9}(-f)?$/) || barcode.match(/^#?12\d{6,9}(-f)?$/)) {
      showToast(`DHL Label: ${barcode}`, 'success');
      navigate(
        `/dashboard/order-search-page?&searchValue=` +
          encodeURIComponent(barcode.replace(/\D/g, '')),
        {
          // replace: true,
        },
      );
      setScannedBarcode(barcode.replace(/\D/g, ''));
    } else {
      console.log(`Barcode "${barcode}" is not recognized!`);
    }
  };

  return null;
}

export default ScannerDetector;
