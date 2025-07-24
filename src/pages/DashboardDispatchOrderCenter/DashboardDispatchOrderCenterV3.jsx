import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '../../apiHooks/useOrders';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
import useOrderList from '../../hooks/useOrderList';
import ReportProblemModal from '../../components/organisms/ReportProblemModal/ReportProblemModal';
import showToast from '../../hooks/useToast';
import axiosInstance from '../../utils/axios';
import { OrderPackingManager } from './components/OrderPackingManager';

const DashboardDispatchOrderCenterV2 = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrder(id);
  const [showModal, setShowModal] = useState(false);
  const [showRequestButton, setShowRequestButton] = useState(false);
  const navigate = useNavigate();
  const [orderLoading, setOrderLoading] = useState(true);
  const { getNextOrder, loading } = useOrderList(setOrderLoading);
  const apiCallRef = useRef(new Set());

  const handleReportProblem = async (selectedOption) => {
    const selectedProblem = selectedOption.value;
    if (selectedProblem) {
      try {
        await axiosInstance.post('/dispatch-center/report-problem', {
          order_id: order?.order?.id,
          report_problem: selectedProblem,
        });
        showToast('Problem reported successfully', 'success');
        navigateToNextOrder();
      } catch (error) {
        showToast('Error reporting problem', 'error');
      }
    }
  };

  const navigateToNextOrder = () => {
    if (loading) return;
    const nextOrder = getNextOrder(parseInt(id));
    if (nextOrder) {
      navigate(`/dashboard/dispatch-center/${nextOrder?.order_no}`);
    } else {
      navigate('/dashboard/dispatch-center');
    }
  };

  const handleCompletion = () => {
    navigateToNextOrder();
  };

  useEffect(() => {
    window.focus();
  }, []);

  const handlePDFDownload = async (pdfUrl, redirect = false, customPdfUrl = null) => {
    try {
      const showPdfInIframe = (url) => {
        return new Promise((resolve) => {
          const iframe = document.createElement('iframe');
          iframe.style.visibility = 'hidden';
          iframe.src = url;
          iframe.onload = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            iframe.contentWindow.onafterprint = () => {
              setTimeout(() => {
                document.body.removeChild(iframe);
                resolve();
              }, 300);
            };
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
                resolve();
              }
            }, 5000);
          };
          document.body.appendChild(iframe);
        });
      };

      const fetchAndConvertToBlobUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      };

      const mainPdfBlobUrl = await fetchAndConvertToBlobUrl(pdfUrl);

      if (order?.order?.country === 'Switzerland') {
        // Show the first iframe
        await showPdfInIframe(mainPdfBlobUrl);

        // If there is a custom PDF URL, show the second iframe
        if (customPdfUrl) {
          const customPdfBlobUrl = await fetchAndConvertToBlobUrl(customPdfUrl);
          await showPdfInIframe(customPdfBlobUrl);
        }

        navigateToNextOrder();
      } else {
        await showPdfInIframe(mainPdfBlobUrl);
        if (redirect) {
          navigateToNextOrder();
        }
      }
    } catch (error) {
      console.error('Error downloading and printing PDF:', error);
    }
  };

  const handleBarcodeUnscan = async (orderId) => {
    if (apiCallRef.current.has(orderId)) return;
    apiCallRef.current.add(orderId);

    try {
      const response = await axiosInstance.get(`/dispatch-center/scan-product?order_id=${orderId}`);
      const pdfBase64 = response?.data?.pdf;
      const customsPdf = response?.data?.costum_pdf;

      if (pdfBase64) {
        await handlePDFDownload(pdfBase64, true, customsPdf);
        return true;
      } else {
        showToast('No PDF available for download. Please report this issue.', 'failure');
        return false;
      }
    } catch (error) {
      console.error('Error fetching PDF:', error);
      showToast('Failed to fetch the PDF. Please try again.', 'failure');
      return false;
    } finally {
      apiCallRef.current.delete(orderId);
    }
  };

  if (isLoading || loading || orderLoading) return <PammysLoading />;

  return (
    <div className="xentral-container">
      <OrderPackingManager
        order={order}
        getNextOrder={getNextOrder}
        setShowModal={setShowModal}
        showModal={showModal}
        id={id}
        setShowRequestButton={setShowRequestButton}
        showRequestButton={showRequestButton}
        handleBarcodeUnscan={handleBarcodeUnscan}
        handleCompletion={handleCompletion}
      />
      <ReportProblemModal
        setShowModal={setShowModal}
        handleReportProblem={handleReportProblem}
        showModal={showModal}
      />
    </div>
  );
};

export default DashboardDispatchOrderCenterV2;
