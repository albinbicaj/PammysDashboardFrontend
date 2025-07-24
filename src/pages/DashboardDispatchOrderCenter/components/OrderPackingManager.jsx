import React, { useEffect, useRef, useState } from 'react';
import { OrderInformation } from './OrderInformation';
import { DispatchCenterCustomTableV3 } from '../../../components/molecules';
import useOrderScanner from '../../../hooks/useOrderScanner';
import { barcodeMappings } from '../../../hooks/barcodeMappings';
import axiosInstance from '../../../utils/axios';
import showToast from '../../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const ScannerDetectorProductPacking = ({ handleScan = () => {}, orderLineItems = [] }) => {
  const barcodeScan = useRef('');
  const debounceTimeout = useRef(null);
  const [notification, setNotification] = useState(null);
  const [localScanned, setLocalScanned] = useState([]);

  useEffect(() => {
    const initialState = orderLineItems.map((item) => ({
      barcode: item.barcode,
      isScanned: false,
    }));
    setLocalScanned(initialState);
    console.log('[INIT] Local scanned list initialized:', initialState);
  }, [orderLineItems]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') return;

      if (e.key === 'Enter') {
        if (barcodeScan.current.length > 3) {
          handleOnScan(barcodeScan.current);
        }
        barcodeScan.current = '';
        clearTimeout(debounceTimeout.current);
        return;
      }

      barcodeScan.current += e.key;

      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        barcodeScan.current = '';
      }, 300); // Shorter timeout to detect end of scan
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(debounceTimeout.current);
    };
  }, []);

  useEffect(() => {
    window.focus();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000); // Auto-hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleOnScan = (barcode) => {
    // Handle override scan
    if (barcode === '0000000000000') {
      setLocalScanned((prev) => {
        const next = prev.find((item) => !item.isScanned);

        if (!next) {
          console.log('[OVERRIDE] All items already scanned');
          setNotification({
            message: 'All items already scanned.',
            type: 'error',
          });
          return prev;
        }

        console.log('[OVERRIDE] Next unscanned barcode:', next.barcode);
        handleScan(next.barcode);

        const updated = prev.map((item) =>
          item.barcode === next.barcode ? { ...item, isScanned: true } : item,
        );

        console.log('[OVERRIDE] Updated scanned list:', updated);
        setNotification({
          message: `Override scan: "${next.barcode}" scanned successfully.`,
          type: 'success',
        });

        return updated;
      });

      return;
    }

    // Regular barcode scan
    if (/^\d{10,14}$/.test(barcode)) {
      const mappedBarcode = barcodeMappings[barcode] || barcode;
      const isValidBarcode = orderLineItems.some((item) => item.barcode === mappedBarcode);

      if (isValidBarcode) {
        handleScan(mappedBarcode);
        setLocalScanned((prev) =>
          prev.map((item) =>
            item.barcode === mappedBarcode ? { ...item, isScanned: true } : item,
          ),
        );
        console.log('[SCAN] Barcode scanned:', mappedBarcode);
        setNotification({
          message: `Barcode "${mappedBarcode}" scanned successfully.`,
          type: 'success',
        });
      } else {
        console.log('[ERROR] Barcode not in order:', barcode);
        setNotification({
          message: `Barcode "${barcode}" is not part of the order.`,
          type: 'error',
        });
      }
    } else {
      console.log('[ERROR] Invalid barcode format:', barcode);
      setNotification({
        message: `Barcode "${barcode}" is not valid.`,
        type: 'error',
      });
    }
  };

  return (
    <>
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div
            className={`rounded-lg p-6 text-white shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <div className="flex items-center">
              <div className="mr-4">
                {notification.type === 'success' ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-lg font-semibold">{notification.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OrderPackingManager = ({
  order = [],
  getNextOrder,
  setShowModal,
  showModal,
  id,
  setShowRequestButton,
  showRequestButton,
  handleBarcodeUnscan,
  handleCompletion,
}) => {
  const [resolveProblemLoading, setResolveProblemLoading] = useState(false);
  const navigate = useNavigate();
  const { items, scanItem, unscanItem } = useOrderScanner(
    order?.order?.id,
    order?.order?.order_line_items,
    handleCompletion,
    handleBarcodeUnscan,
  );

  const handleResolveProblem = async (orderId) => {
    setResolveProblemLoading(true);
    try {
      await axiosInstance.post('/dispatch-center/resolve-problem', { order_id: orderId });
      showToast('Problem resolved successfully', 'success');
      setResolveProblemLoading(false);
      navigate(`/dashboard/dispatch-center`);
    } catch (error) {
      showToast('Error resolving problem', 'error');
      setResolveProblemLoading(false);
      navigate(`/dashboard/dispatch-center`);
    }
  };

  return (
    <>
      <ScannerDetectorProductPacking
        handleScan={scanItem}
        orderLineItems={order?.order?.order_line_items}
      />
      <OrderInformation
        order={order}
        setShowModal={setShowModal}
        showModal={showModal}
        getNextOrder={getNextOrder}
        id={id}
        setShowRequestButton={setShowRequestButton}
        showRequestButton={showRequestButton}
        handleResolveProblem={handleResolveProblem}
        resolveProblemLoading={resolveProblemLoading}
      />
      <div className="">
        <div className="w-full">
          <DispatchCenterCustomTableV3
            items={items}
            handleBarcodeScan={scanItem}
            handleBarcodeUnscan={unscanItem}
          />
        </div>
      </div>
    </>
  );
};
