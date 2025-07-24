import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from '../utils/notification';
import showToast from './useToast';
import useOrderList from './useOrderList';
import { barcodeMappings } from './barcodeMappings';

const useOrderScanner = (orderId, initialItems = [], onComplete, handleBarcodeUnscan) => {
  const [items, setItems] = useState(() => {
    const storedData = localStorage.getItem(`order_${orderId}`);
    return storedData
      ? JSON.parse(storedData)
      : Array.isArray(initialItems)
        ? initialItems.map((item) => ({
            ...item,
            scanned_quantity: 0,
            remained_quantity: item.quantity,
          }))
        : [];
  });

  const navigate = useNavigate();
  const { getNextOrder } = useOrderList();

  useEffect(() => {
    localStorage.setItem(`order_${orderId}`, JSON.stringify(items));
  }, [items, orderId]);

  const scanItem = (barcode) => {
    // Check if the barcode needs to be mapped
    const mappedBarcode = barcodeMappings[barcode] || barcode;

    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.barcode === mappedBarcode && item.scanned_quantity < item.quantity) {
          showToast(`${item?.item} - PACKED`);
          return {
            ...item,
            scanned_quantity: item.scanned_quantity + 1,
            remained_quantity: item.remained_quantity - 1,
          };
        }
        return item;
      });

      checkAllScanned(updatedItems);
      return updatedItems;
    });
  };

  const unscanItem = (barcode) => {
    // Check if the barcode needs to be mapped
    const mappedBarcode = barcodeMappings[barcode] || barcode;

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.barcode === mappedBarcode && item.scanned_quantity > 0) {
          showToast(`${item?.item} - UNPACKED`, 'failure');
          return {
            ...item,
            scanned_quantity: item.scanned_quantity - 1,
            remained_quantity: item.remained_quantity + 1,
          };
        }
        return item;
      });
    });
  };

  const checkAllScanned = async (updatedItems) => {
    if (updatedItems.every((item) => item.scanned_quantity === item.quantity)) {
      const nextOrder = getNextOrder(parseInt(orderId));
      const pdfAvailable = await handleBarcodeUnscan(orderId);

      if (pdfAvailable) {
        if (nextOrder) {
          navigate(`/dashboard/dispatch-center/${nextOrder?.order_no}`);
        } else {
          navigate('/dashboard/dispatch-center');
        }
        onComplete();
        notification('All items scanned.');
        showToast(`ALL ITEMS - PACKED`);
      }
    }
  };

  return { items, scanItem, unscanItem };
};

export default useOrderScanner;
