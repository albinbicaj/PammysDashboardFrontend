import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../../utils/axios';
import showToast from '../../hooks/useToast';
import { usePickerData } from '../../apiHooks/useOrders';
import DashboardUIPickerPage from './DashboardUIPickerPage';

const DashboardPickerPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1000);
  const [openRows, setOpenRows] = useState([]);
  const [columnFilters, setColumnFilters] = useState({});
  const [filters, setFilters] = useState({
    filterDate: false,
    sortBy: 'asc',
    sortWith: '',
    paymentMethod: [],
  });
  const [activeTab, setActiveTab] = useState('register_picker');
  const [saveQuery, setSaveQuery] = useState('');
  const [scannerColor, setScannerColor] = useState('border-red-500');
  const [scannerPaused, setScannerPaused] = useState(false);
  const scannerRef = useRef(null);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [scannedUserId, setScannedUserId] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const {
    data: pickerData,
    isLoading: loadingTable,
    refetch: refetchPickerData,
  } = usePickerData(saveQuery, activeTab, columnFilters, filters, page, rowsPerPage);
  console.log(pickerData, 'pickerData');

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    await refetchPickerData();
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    await refetchPickerData();
  };

  const handleBarcodeScan = async (scannedData) => {
    if (scannerPaused) return;

    try {
      let newBarcode = '';
      let newUserId = '';

      scannedData.forEach((data) => {
        if (data.format === 'qr_code') {
          try {
            const parsedData = JSON.parse(data.rawValue);
            newUserId = parsedData?.i || '';
          } catch (error) {
            console.error('Invalid QR code format:', error);
          }
        } else {
          let rawBarcode = data.rawValue || '';
          if (rawBarcode.length > 0 && (rawBarcode[0] === 'P' || rawBarcode[0] === 'p')) {
            rawBarcode = rawBarcode.substring(1);
          }
          newBarcode = rawBarcode;
        }
      });

      if (newUserId) {
        setScannedUserId(newUserId);
      }

      if (newBarcode) {
        setScannedBarcode(newBarcode);
      }

      if ((newUserId && !scannedBarcode) || (!newUserId && newBarcode)) {
        setScannerColor('border-orange-500');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } else if (newUserId && newBarcode) {
        setScannerColor('border-green-500');
        setShowNotification(false);
      }
    } catch (error) {
      console.error('Error handling barcode scan:', error);
    }
  };

  useEffect(() => {
    const trySubmit = async () => {
      if (scannedUserId && scannedBarcode) {
        setScannerPaused(true);
        setScannerColor('border-green-500');
        setShowNotification(false);

        try {
          const response = await axiosInstance.post('/picklist/assign-picker', {
            user_id: scannedUserId,
            barcode: scannedBarcode,
          });

          if (!response.data.error) {
            showToast('Erfolgreich', 'success');
          } else {
            showToast('Nicht gefunden', 'failure');
          }
        } catch (err) {
          console.error('API error:', err);
        }

        setTimeout(() => {
          setScannedUserId('');
          setScannedBarcode('');
          setScannerPaused(false);
          setScannerColor('border-red-500');
          if (scannerRef.current) scannerRef.current.reset();
        }, 2000);

        await refetchPickerData();
        if (pickerData?.list?.data?.length > 0) {
          await handleNextPickerClick();
        }
      }
    };

    trySubmit();
  }, [scannedUserId, scannedBarcode]);

  const handleNextPickerClick = async () => {
    const nextPickerIds = pickerData?.list?.data?.map((item) => item.id);
    await axiosInstance
      .post(`/picklist/next-picker`, {
        picklist_ids: nextPickerIds,
      })
      .then(() => {
        showToast('Erfolgreich zugewiesen', 'success');
      });
    await refetchPickerData();
  };

  const handleDeletePicker = async (data) => {
    try {
      const response = await axiosInstance.post('/picklist/unassign-picker', {
        user_id: data.picked_by,
        barcode: data.barcode != '' && data.barcode,
      });
      if (!response.data.error) {
        showToast('Erfolgreich', 'success');
      }
      await refetchPickerData();
    } catch (error) {
      console.error('Error scanning barcode:', error);
    }
    setPage(0);
  };

  const handleFilterChange = (column, value) => {
    setColumnFilters((prevFilters) => {
      if (value === '') {
        const { [column.field]: omit, ...restFilters } = prevFilters;
        return restFilters;
      }
      return {
        ...prevFilters,
        [column.field]: value,
      };
    });
    setPage(0);
  };

  const toggleRow = (rowId) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(rowId)
        ? prevOpenRows.filter((id) => id !== rowId)
        : [...prevOpenRows, rowId],
    );
  };

  const updateFilters = (fieldsToUpdate) => {
    setFilters((prevContext) => {
      let updatedContext = { ...prevContext };
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        updatedContext[key] = value;
      }
      return updatedContext;
    });
  };

  const handleSortBy = (sort) => {
    if (filters.sortBy === sort.sortBy && filters.sortWith === sort.sortWith) {
      updateFilters({ sortBy: 'asc', sortWith: '' });
    } else {
      updateFilters(sort);
    }
    setPage(0);
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    setColumnFilters({});
    setPage(0);

    if (newValue === 'register_picker') {
      setRowsPerPage(1000);
    } else {
      setRowsPerPage(10);
    }
  };

  useEffect(() => {
    const container = document.querySelector('.xentral-container');
    if (container) {
      container.style.outline = 'none';
      container.style.border = 'none';
      container.focus();
    }
  }, []);

  return (
    <DashboardUIPickerPage
      handleBarcodeScan={handleBarcodeScan}
      activeTab={activeTab}
      scannerRef={scannerRef}
      scannerPaused={scannerPaused}
      scannerColor={scannerColor}
      scannedUserId={scannedUserId}
      scannedBarcode={scannedBarcode}
      handleChange={handleChange}
      pickerData={pickerData}
      filters={filters}
      columnFilters={columnFilters}
      handleFilterChange={handleFilterChange}
      loadingTable={loadingTable}
      toggleRow={toggleRow}
      handleSortBy={handleSortBy}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      page={page}
      rowsPerPage={rowsPerPage}
      handleDeletePicker={handleDeletePicker}
      openRows={openRows}
      showNotification={showNotification}
    />
  );
};
export default DashboardPickerPage;
