import { useEffect } from 'react';
import { logWithTimestamp } from '../../../utils/helpers';

function ScannerDetectorProductPacking({
  handleScan = () => {},
  refetch = () => {},
  orderItems = [],
}) {
  // console.log('SCANNER DETECTOR LISTENING FOR PACKER');
  // console.log(orderItems);
  let barcodeScan = '';
  useEffect(() => {
    let debounceTimeout;

    const handleKeyDown = (e) => {
      if (e.key === 'Shift') return;
      // console.log('SDPP:', e.key);
      if (e.key === 'Enter') {
        console.log('ENTER SDPP:', e.key);
        if (barcodeScan.length > 3) {
          handleOnScan(barcodeScan, orderItems);
        }
        barcodeScan = '';
        return;
      }
      barcodeScan += e.key;

      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        barcodeScan = '';
      }, 200);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(debounceTimeout);
    };
  }, [orderItems]);

  const handleOnScan = (barcode, orderItems) => {
    logWithTimestamp('SDPP handleOnScan Called.');

    if (barcode.match(/^\d{10,14}$/i)) {
      console.log('SDPP handleOnScan REGEX TRUE.');
      handleScan({ barcode, orderItems });
      return;
    } else {
      console.log(`Barcode "${barcode}" is not in products list!`);
    }
  };

  return null;
}

export default ScannerDetectorProductPacking;
