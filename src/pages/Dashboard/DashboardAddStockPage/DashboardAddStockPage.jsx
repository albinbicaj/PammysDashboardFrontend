import { useEffect, useState } from 'react';
import useDocumentTitle from '../../../components/useDocumentTitle';
import { useProductsVariantData } from '../../../apiHooks/useOrders';
import showToast from '../../../hooks/useToast';
import axiosInstance from '../../../utils/axios';
import { barcodeMappings } from '../../../hooks/barcodeMappings';
import DashboardAddStockUIPage from './DashboardAddStockUIPage';

const steps = ['Artikel scannen', 'Bestand abschicken'];

const DashboardAddStockPage = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedActiveTab = localStorage.getItem('activeTab');
    return savedActiveTab || 'add_scanning';
  });

  const [activeStep, setActiveStep] = useState(0);
  const [subActiveTab, setSubActiveTab] = useState(() => {
    const savedSubActiveTab = localStorage.getItem('subActiveTab');
    return savedSubActiveTab ? parseInt(savedSubActiveTab, 10) : 0;
  });

  const [completed, setCompleted] = useState({});
  const [handleSubmitLoading, setHandleSubmitLoading] = useState(false);
  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem('scannedLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  const [googleSheetName, setGoogleSheetName] = useState(() => {
    const savedSheetName = localStorage.getItem('googleSheetName');
    return savedSheetName || '';
  });

  const [isScanComplete, setIsScanComplete] = useState(() => {
    const savedLogs = localStorage.getItem('scannedLogs');
    return !!savedLogs && JSON.parse(savedLogs).length > 0;
  });

  const { data: productsVariantData, loading: isLoading } = useProductsVariantData();
  const [cartonSize, setCartonSize] = useState('50');
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    localStorage.setItem('scannedLogs', JSON.stringify(logs));
    localStorage.setItem('googleSheetName', googleSheetName);
    localStorage.setItem('activeTab', activeTab);
    localStorage.setItem('subActiveTab', subActiveTab);
  }, [logs, googleSheetName, activeTab, subActiveTab]);

  useEffect(() => {
    if (activeTab === 'count_scanning') {
      const savedSubActiveTab = localStorage.getItem('subActiveTab');
      const parsedSubActiveTab = savedSubActiveTab ? parseInt(savedSubActiveTab, 10) : 0;
      setSubActiveTab(parsedSubActiveTab);
    }
  }, [activeTab]);

  useEffect(() => {
    if (productsVariantData && !isLoading) {
      localStorage.setItem('productsVariantData', JSON.stringify(productsVariantData));
      showToast(
        'Produktdaten wurden lokal gespeichert. Sie können jetzt offline arbeiten.',
        'success',
      );
    }
  }, [productsVariantData, isLoading]);

  const handleNext = () => {
    setCompleted((prev) => ({ ...prev, [activeStep]: true }));
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCompleted((prev) => {
      const updated = { ...prev };
      delete updated[activeStep - 1];
      return updated;
    });
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    window.focus();
  }, []);

  const aggregateLogsForUI = (logs) => {
    return logs.reduce((acc, log) => {
      const key = `${log.barcode_number}-${log.adjustment_type}-${log.carton_size}`;
      const existing = acc.find(
        (item) =>
          item.barcode_number === log.barcode_number &&
          item.adjustment_type === log.adjustment_type &&
          item.carton_size === log.carton_size,
      );
      if (existing) {
        existing.quantity += log.quantity;
      } else {
        acc.push({ ...log });
      }
      return acc;
    }, []);
  };

  const aggregateLogsForBackend = (logs) => {
    return logs.reduce((acc, log) => {
      const key = `${log.barcode_number}-${log.adjustment_type}`;
      const existing = acc.find(
        (item) =>
          item.barcode_number === log.barcode_number &&
          item.adjustment_type === log.adjustment_type,
      );
      const cartonQty = log.quantity * parseInt(log.carton_size || '0', 10);
      if (existing) {
        existing.quantity += log.quantity;
        existing.total_quantity += cartonQty;
      } else {
        acc.push({
          barcode_number: log.barcode_number,
          quantity: log.quantity,
          adjustment_type: log.adjustment_type,
          carton_size: parseInt(log.carton_size, 10), // use first scanned carton_size
          total_quantity: cartonQty,
        });
      }
      return acc;
    }, []);
  };

  const handleSubmit = async () => {
    setHandleSubmitLoading(true);
    try {
      const aggregatedLogs = aggregateLogsForBackend(logs);

      const payload = {
        items: aggregatedLogs,
        googleSheetName,
      };
      const response = await axiosInstance.put('product/add-stock-by-barcodes', payload);
      const csvUrl = response.data.csv_url;
      const link = document.createElement('a');
      link.href = csvUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setHandleSubmitLoading(false);
      localStorage.removeItem('scannedLogs');
      localStorage.removeItem('googleSheetName');
      localStorage.removeItem('productsVariantData');
      localStorage.removeItem('activeTab');
      setLogs([]);
      setGoogleSheetName('');
      setIsScanComplete(false);
      handleReset();
      showToast('Bestand erfolgreich für alle Varianten aktualisiert.', 'success');
    } catch (error) {
      setHandleSubmitLoading(false);
      showToast(
        'Fehler beim Aktualisieren des Bestands. Bitte stellen Sie sicher, dass Sie mit dem Internet verbunden sind, oder es ist ein unbekannter Fehler aufgetreten.',
        'failure',
      );
    }
  };

  const handleBarcodeScan = (barcode) => {
    const savedProductsVariantData = localStorage.getItem('productsVariantData');
    const productsData = savedProductsVariantData
      ? JSON.parse(savedProductsVariantData)
      : productsVariantData;
    const effectiveBarcode = barcodeMappings[barcode] || barcode;
    const product = productsData?.find((item) => item.barcode_number === effectiveBarcode);
    if (product) {
      const effectiveCartonSize = isEditable
        ? cartonSize
        : subActiveTab === 1 && activeTab === 'count_scanning'
          ? '1'
          : product.quantity_in_box.toString();
      const logEntry = {
        id: product.id,
        variant_name: `${product?.product?.title} - ${product.title}`,
        barcode_number: effectiveBarcode,
        sku: product?.sku,
        quantity: 1,
        adjustment_type: activeTab === 'add_scanning' ? 'add' : 'update',
        carton_size: effectiveCartonSize,
        created_at: new Date().toISOString(),
      };
      setLogs((prevLogs) => [logEntry, ...prevLogs]);
      setIsScanComplete(true);
      showToast(
        'Bestand erfolgreich aktualisiert für die Variante mit dem angegebenen Barcode ' +
          effectiveBarcode,
        'success',
      );
    } else {
      showToast('Bei diesem Barcode ist etwas schief gelaufen: ' + effectiveBarcode, 'failure');
    }
  };

  const aggregatedLogs = aggregateLogsForUI(logs);
  const totalQuantity = aggregatedLogs.reduce((sum, log) => sum + log.quantity, 0);
  const totalCartonSize = aggregatedLogs.reduce(
    (sum, log) => sum + log.quantity * parseInt(log.carton_size || '0', 10),
    0,
  );

  const handleRemoveLog = (id, createdAt) => {
    setLogs((prevLogs) =>
      prevLogs.filter((log) => !(log.id === id && log.created_at === createdAt)),
    );
  };

  useDocumentTitle('Pammys | Bestand hinzufügen');

  return (
    <DashboardAddStockUIPage
      handleBarcodeScan={handleBarcodeScan}
      activeStep={activeStep}
      activeTab={activeTab}
      handleChange={handleChange}
      logs={logs}
      steps={steps}
      cartonSize={cartonSize}
      setCartonSize={setCartonSize}
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      googleSheetName={googleSheetName}
      setGoogleSheetName={setGoogleSheetName}
      isLoading={isLoading}
      aggregatedLogs={aggregatedLogs}
      totalQuantity={totalQuantity}
      totalCartonSize={totalCartonSize}
      handleBack={handleBack}
      handleSubmitLoading={handleSubmitLoading}
      handleSubmit={handleSubmit}
      isScanComplete={isScanComplete}
      handleNext={handleNext}
      completed={completed}
      handleRemoveLog={handleRemoveLog}
      subActiveTab={subActiveTab}
      setSubActiveTab={setSubActiveTab}
    />
  );
};

export default DashboardAddStockPage;
