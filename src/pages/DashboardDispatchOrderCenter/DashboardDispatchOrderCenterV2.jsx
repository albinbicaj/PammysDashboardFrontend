import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Alert, Snackbar, Typography } from '@mui/material';
import { DispatchCenterCustomTableV2 } from '../../components/molecules';
import axiosInstance from '../../utils/axios';
import ScannerDetectorProductPacking from '../../components/organisms/ScannerDetector/ScannerDetectorProductPacking';
import showToast from '../../hooks/useToast';
import { logWithTimestamp } from '../../utils/helpers';
import useOrderList from '../../hooks/useOrderList';
import PermissionCheck from '../../components/molecules/PermissionCheck/PermissionCheck';
import { RoleEnum } from '../../enums/Role.enum';
import ReportProblemModal from '../../components/organisms/ReportProblemModal/ReportProblemModal';

const DashboardDispatchOrderCenterV2 = () => {
  const [data, setData] = useState([]);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    quantity: '',
    message: '',
  });

  const [loadingFullTable, setLoadingFullTable] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [showRequestButton, setShowRequestButton] = useState(false);
  const [dispatchCenterOrder, setDispatchCenterOrder] = useState({});
  const [showModal, setShowModal] = useState(false);

  const { vertical, horizontal } = state;

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { id } = useParams();
  const location = useLocation();
  const { getNextOrder } = useOrderList();

  useEffect(() => {
    window.focus();
  }, [location]);

  const fetchData = async () => {
    logWithTimestamp('fetch /dispatch-center/get-order STARTED');

    setLoadingTable(true);
    try {
      const response = await axiosInstance.get('/dispatch-center/get-order', {
        params: {
          order_number: parseInt(id),
        },
      });
      logWithTimestamp('fetch /dispatch-center/get-order ENDED');
      if (response.data.message == 'Dieser Auftrag wird im Dispatch Center nicht gefunden') {
        // navigate('/dashboard/dispatch-center');
      }
      setData(response.data.order);
      setDispatchCenterOrder(response.data.dispatch_center);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingTable(false);
    }
  };

  const handlePDFDownload2 = async (pdf, redirect = false) => {
    try {
      const base64String = pdf;
      const base64StringSplit = base64String?.split(',')[1];

      const byteCharacters = atob(base64StringSplit);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.onload = () => {
          newWindow.focus();
        };

        newWindow.onunload = () => {
          URL.revokeObjectURL(url);
          if (redirect) {
            const nextOrder = getNextOrder(parseInt(id));
            if (nextOrder) {
              navigate(`/dashboard/dispatch-center/${nextOrder.order_no}`);
            } else {
              navigate('/dashboard/dispatch-center');
            }
          }
        };
      } else {
        throw new Error('Failed to open new window');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handlePDFDownload = async (pdf, redirect = false) => {
    logWithTimestamp('handlePDFDownload STARTED');

    setLoadingFullTable(true);
    try {
      const base64String = pdf;
      const base64StringSplit = base64String?.split(',')[1];

      const byteCharacters = atob(base64StringSplit);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      let iframe = document.createElement('iframe');
      iframe.style.visibility = 'hidden';
      iframe.src = url;
      const rootDiv = document.getElementById('root');
      if (rootDiv) {
        rootDiv.appendChild(iframe);
      }
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      if (redirect && data?.country !== 'Switzerland') {
        iframe.contentWindow.onafterprint = () => {
          setTimeout(() => {
            document.body.removeChild(iframe);
            const nextOrder = getNextOrder(parseInt(id));
            if (nextOrder) {
              navigate(`/dashboard/dispatch-center/${nextOrder.order_no}`);
            } else {
              navigate('/dashboard/dispatch-center');
            }
          }, 100);
        };
        setTimeout(() => {
          const nextOrder = getNextOrder(parseInt(id));
          if (nextOrder) {
            navigate(`/dashboard/dispatch-center/${nextOrder.order_no}`);
          } else {
            navigate('/dashboard/dispatch-center');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      logWithTimestamp('handlePDFDownload ENDED');
      setTimeout(() => {
        setLoadingFullTable(false);
      }, 7000);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({ ...state, open: false });
  };

  const handleBarcodeScanWithScanner = async ({ barcode = '', orderItems = [] }) => {
    logWithTimestamp('Pack with Scanner request STARTED ');

    try {
      showToast('Packing product', 'success');
      setLoadingTable(true);

      const matchedBarcode = orderItems?.find((item) => item.barcode == barcode);
      if (!matchedBarcode) {
        showToast(`Barcode "${barcode}" not found in order items!`, 'error');
        return;
      }

      const response = await axiosInstance.get('/dispatch-center/scan-product', {
        params: {
          order_id: data?.id,
          barcode: barcode,
        },
      });

      const { pdf, pdf_customs_url, quantity, message, status } = response?.data || {};

      if (quantity) {
        showToast(`Quantity: ${quantity}`, 'success');
      }
      if (message) {
        showToast(message, 'success');
      }

      if (pdf) {
        handlePDFDownload(pdf, !pdf_customs_url);
        setShowRequestButton(false);
      } else {
        setShowRequestButton(true);
      }

      fetchData();

      if (status === 'completed') {
        showToast('Order is completed!', 'success');
      }

      logWithTimestamp('Pack with Scanner request ENDED ');
      setSearchTerm('');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error scanning barcode. Please try again.';
      showToast(errorMessage, 'error');
      setLoadingTable(false);
      console.error('Error scanning barcode:', error);
    }
  };

  const handleBarcodeScan = async ({ barcode = '' }) => {
    try {
      showToast('Packing product', 'success');
      setLoadingTable(true);

      const response = await axiosInstance.get('/dispatch-center/scan-product', {
        params: {
          order_id: data?.id,
          barcode: barcode,
        },
      });

      const { pdf, pdf_customs_url, quantity, message, status } = response?.data || {};

      if (quantity) {
        showToast(`Quantity: ${quantity}`, 'success');
      }
      if (message) {
        showToast(message, 'success');
      }

      if (pdf) {
        handlePDFDownload(pdf, !pdf_customs_url);
        setShowRequestButton(false);
      } else {
        setShowRequestButton(true);
      }

      fetchData();

      if (status === 'completed') {
        showToast('Order is completed!', 'success');
      }

      setSearchTerm('');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error scanning barcode. Please try again.';
      showToast(errorMessage, 'error');
      setLoadingTable(false);
      console.error('Error scanning barcode:', error);
    }
  };

  const handleBarcodeUnscan = async (barcode = '') => {
    try {
      const response = await axiosInstance.post('/dispatch-center/unscan-product', {
        order_id: data?.id,
        barcode: barcode,
      });
      showToast(response.data.message, 'success');
      fetchData();
    } catch (error) {
      showToast('Error unpacking product:', 'error');
      console.error('Error scanning barcode:', error);
    }
  };

  const goBack = () => {
    navigate('/dashboard/dispatch-center');
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleMarkAsFulfilled = async (orderId) => {
    try {
      await axiosInstance.post('/dispatch-center/mark-order-fulfilled', {
        id: orderId,
      });
      showToast('Order marked as fulfilled', 'success');
    } catch (error) {
      console.error('Error marking order as fulfilled:', error);
      showToast('Something went wrong!', 'failure');
    }
  };

  const handleReportProblem = async (selectedOption) => {
    const selectedProblem = selectedOption.value;
    if (selectedProblem) {
      try {
        await axiosInstance.post('/dispatch-center/report-problem', {
          order_id: data?.id,
          report_problem: selectedProblem,
        });
        showToast('Problem reported successfully', 'success');
        const nextOrder = getNextOrder(parseInt(id));
        if (nextOrder) {
          navigate(`/dashboard/dispatch-center/${nextOrder.order_no}`);
        } else {
          navigate('/dashboard/dispatch-center');
        }
      } catch (error) {
        console.error('Error reporting problem:', error);
        showToast('Error reporting problem', 'error');
      }
    }
  };

  return (
    <div className="xentral-container">
      <ScannerDetectorProductPacking
        handleScan={handleBarcodeScanWithScanner}
        orderItems={data?.order_line_items}
      />
      <div className="flex gap-2 pb-2">
        <h1 className="text-4xl font-bold">Kiste:</h1>
        <strong className="text-4xl font-bold">{dispatchCenterOrder?.kiste_number}</strong>
      </div>
      <div className="mb-7 flex justify-between gap-3">
        <div className="flex ">
          <button
            onClick={goBack}
            className="focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625 mr-3 box-border   border-2 border-gray-300 bg-gray-200 px-4 py-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
          >
            Zurück
          </button>
        </div>
        <div className="  flex flex-1 justify-between border-2 bg-white p-4 ">
          <div className="flex w-full flex-wrap items-start gap-12">
            <Typography variant="p" component="p">
              Bestellung:{' '}
              <Link
                className="font-bold"
                target="_blank"
                to={`https://admin.shopify.com/store/pummmys/orders/${data?.shopify_order_id}`}
              >
                {data?.order_name}
              </Link>
            </Typography>
            <Typography variant="p" component="p">
              Kunde: <span className="font-bold">{data?.costumer}</span>
            </Typography>
            <Typography variant="p" component="p">
              Adresse:{' '}
              <span className="font-bold">
                {`${data?.shipping_address_address1} ${data?.shipping_address_address2}, ${data?.shipping_address_zip} ${data?.shipping_address_city}, ${data?.shipping_address_country}`}
              </span>
            </Typography>
            {data?.tracking_number && data?.status == 'completed' && (
              <Typography variant="p" component="div">
                Versandetikett:{' '}
                <span
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => {
                    if (data?.shipping_label_download_url) {
                      handlePDFDownload2(data?.shipping_label_download_url, false);
                    }
                  }}
                >
                  {data?.tracking_number}
                </span>
              </Typography>
            )}
            {data?.pdf_customs_url && (
              <Typography variant="p" component="div">
                Zoll:{' '}
                <span
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => {
                    if (data?.pdf_customs_url) {
                      handlePDFDownload2(data?.pdf_customs_url, false);
                    }
                  }}
                >
                  Customs PDF
                </span>
              </Typography>
            )}
          </div>
        </div>
        <PermissionCheck roles={[RoleEnum.ADMIN, RoleEnum.PICK, RoleEnum.WAREHOUSE_EMPLOYEE]}>
          {showRequestButton && dispatchCenterOrder?.report_problem === null && (
            <div className="flex ">
              <button
                className="bg-accent px-4 py-2 text-sm font-semibold"
                onClick={() => setShowModal(true)}
                disabled={dispatchCenterOrder?.report_problem !== null}
              >
                Report Problem
              </button>
            </div>
          )}
          {dispatchCenterOrder?.report_problem !== null && !showRequestButton && (
            <div className="focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625 mr-3 box-border   border-2 border-gray-300 bg-gray-200 px-4 py-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none">
              <div className="font-bold">Reported problem:</div>
              <div className="flex ">{dispatchCenterOrder?.report_problem}</div>
            </div>
          )}
        </PermissionCheck>
        <PermissionCheck roles={[RoleEnum.IEM]}>
          <button
            className="btn btn-primary"
            onClick={() => {
              handleMarkAsFulfilled(data?.id);
              navigate('/dashboard/dispatch-center');
            }}
          >
            Mark as fulfilled
          </button>
        </PermissionCheck>
      </div>
      {(isOrderCompleted || data?.status == 'completed') && data?.tracking_number ? (
        <div className="mb-7 flex gap-3 bg-[#2e7d32] p-3 text-[#fff]">
          <svg
            className="h-[24px] w-[24px]"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 50 50"
          >
            <path
              d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"
              fill="white"
            ></path>
          </svg>{' '}
          Dieser Auftrag ist bereits erfüllt
        </div>
      ) : null}

      <div>
        <div className="w-full">
          <div>
            <DispatchCenterCustomTableV2
              data={data}
              handleBarcodeScan={handleBarcodeScan}
              handleBarcodeUnscan={handleBarcodeUnscan}
              loadingTable={loadingTable}
              loadingFullTable={loadingFullTable}
            />
          </div>
        </div>
      </div>
      {!state.message && (
        <Snackbar
          open={state.open}
          autoHideDuration={6000}
          onClose={handleClose}
          key={'top' + 'right'}
          anchorOrigin={{ vertical, horizontal }}
          sx={{
            '& .MuiPaper-root': {
              color: '#fff',
              backgroundColor: 'rgb(74, 222, 128)',
              padding: '20px',
            },
          }}
        >
          <Alert severity="success" variant="filled" sx={{ width: '400px' }}>
            Produktmenge : {state?.quantity}
          </Alert>
        </Snackbar>
      )}
      <ReportProblemModal
        setShowModal={setShowModal}
        handleReportProblem={handleReportProblem}
        showModal={showModal}
      />
    </div>
  );
};

export default DashboardDispatchOrderCenterV2;
