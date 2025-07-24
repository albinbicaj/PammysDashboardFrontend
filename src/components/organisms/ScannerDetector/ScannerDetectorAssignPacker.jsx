import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ScannerDetectorAssignPacker({ handleScan = () => {}, refetch = () => {} }) {
  // handleScan = () => {},
  const navigate = useNavigate();
  let barcodeScan = '';

  useEffect(() => {
    let debounceTimeout;

    const handleKeyDown = (e) => {
      // console.log(e.key);
      if (e.key === 'Shift') return; // Ignore Shift key

      if (e.key === 'Enter') {
        if (barcodeScan.length > 3) {
          handleOnScan(barcodeScan); // Call the handler if valid
        }
        barcodeScan = ''; // Clear the barcode input regardless of length
        return;
      }
      // Accumulate barcode input
      barcodeScan += e.key;

      // Clear barcodeScan after 200ms of inactivity (debounce)
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        barcodeScan = '';
      }, 20000);
    };

    // Add listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(debounceTimeout); // Ensure timeout is cleared
    };
  }, []); // Empty dependency array for mounting once

  // V1 old logic, working but above is improved
  // useEffect(() => {
  //   function handleKeyDown(e) {
  //     if (e.keyCode === 13 && barcodeScan.length > 3) {
  //       console.log('Fomrati Pnnnnnn');
  //       console.log(barcodeScan);
  //       handleOnScan(barcodeScan);
  //       return;
  //     }

  //     if (e.keyCode === 16) {
  //       return;
  //     }

  //     barcodeScan += e.key;
  //     console.log(e.key);
  //     setTimeout(() => {
  //       barcodeScan = '';
  //     }, 200);
  //   }

  //   document.addEventListener('keydown', handleKeyDown);

  //   return function cleanup() {
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // });

  const handleOnScan = (barcode) => {
    // Check if the barcode starts with 'p' or 'P'
    if (barcode.startsWith('p') || barcode.startsWith('P')) {
      // Keep the barcode as it is
      if (barcode.slice(1).match(/^\d+$/)) {
        console.log('Format: PNNNNNN me callback');
        handleScan(barcode, refetch);
      } else {
        console.log(`Barcode "${barcode}" is not recognized!!!`);
      }
    } else {
      // Process the barcode as it is
      if (barcode.match(/^\d{4,7}$/)) {
        console.log('Format: 4 - 7 digits, navigating to dispatch center/', barcode);
        navigate(`/dashboard/dispatch-center/${barcode}`);
        return;
      } else {
        console.log(`Barcode "${barcode}" is not recognized!!!`);
      }
    }
  };

  return null;
  return (
    <div>
      <p>Scanner is ready. Start scanning barcodes!</p>
    </div>
  );
}

export default ScannerDetectorAssignPacker;
