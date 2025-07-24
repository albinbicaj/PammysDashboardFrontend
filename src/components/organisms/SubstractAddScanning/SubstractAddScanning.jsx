import { IconScan } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import axiosInstance from '../../../utils/axios';
import showToast from '../../../hooks/useToast';

const ScannerListener = ({ handleScan }) => {
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

  return null;
};

export const SubstractAddScanning = ({ fetchStockLogs }) => {
  const [inputValue, setInputValue] = useState(0);

  const handleSearchChange = (event) => {
    setInputValue(parseInt(event.target.value, 10) || 0);
  };

  function incrementCount() {
    setInputValue((prevValue) => prevValue + 1);
  }

  function decrementCount() {
    setInputValue((prevValue) => Math.max(prevValue - 1, 0));
  }

  const handleScan = async (barcode) => {
    try {
      await axiosInstance.post('/product/add-stock-by-barcode?Content-Type=application/json', {
        barcode: barcode,
        quantity: 1,
        carton_size: inputValue,
        adjustment_type: 'substract',
      });
      showToast(
        'Bestand erfolgreich aktualisiert für die Variante mit dem angegebenen Barcode ' + barcode,
        'success',
      );
      fetchStockLogs();
    } catch (error) {
      showToast('Bei diesem Barcode ist etwas schief gelaufen ' + barcode, 'error');
      console.error('Error adding stock by barcode:', error);
      // Optionally, you can display a notification or handle the error accordingly
    }
  };

  return (
    <>
      <ScannerListener handleScan={handleScan} />
      <div className="border-[rgba(224, 224, 224, 1)] mt-4 flex w-auto items-center justify-between border bg-white p-4">
        <div className="flex items-center gap-4">
          <p>Kartongröße abziehen</p>
          <div className="input flex w-auto items-center pl-3">
            <button onClick={decrementCount}>-</button>
            <input
              type="number"
              value={inputValue}
              onChange={handleSearchChange}
              className="w-46 m-0 max-w-max border-none px-4 text-center outline-none"
            />
            <button onClick={incrementCount}>+</button>
          </div>
        </div>
      </div>
      <div className="border-[rgba(224, 224, 224, 1)] mb-4 mt-5 flex flex-col items-center justify-center bg-white p-8 text-center">
        <h2 className="text-2xl">
          Bestand durch Scannen <br /> des Barcodes subtrahieren
        </h2>
        <div>
          <IconScan stroke={2} size={300} className="text-gray-500" />
        </div>
      </div>
    </>
  );
};
