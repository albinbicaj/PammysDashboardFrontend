import {
  Alert,
  Snackbar,
  Stack,
  TableCell,
  Typography,
  styled,
  tableCellClasses,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DispatchCenterCustomTable } from '../../components/molecules';
import axiosInstance from '../../utils/axios';
import { notification } from '../../utils/notification';
import { useLocation } from 'react-router-dom';
import { RoleEnum } from '../../enums/Role.enum';
import { useAuthContext } from '../../context/Auth.context';
import ScannerDetectorDispatch from '../../components/organisms/ScannerDetector/ScannerDetectorDispatch';

const ScannerListener = ({
  onValidString,
  data,
  setOpen,
  setSnackbarSeverity,
  setSnackbarMessage,
  goBack,
}) => {
  const [typedString, setTypedString] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && typedString.length > 2 && typedString != 'A1B2C3D4E5') {
      const foundOrder = data?.order_line_items?.find((item) => item.barcode == typedString);
      setTypedString('');
      setOpen(true);
      if (foundOrder) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Success');
        onValidString(typedString);
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage(`Produkt nicht gefunden ${typedString}`);
        return;
      }
    } else {
      setTypedString((prevString) => prevString + e.key);
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [typedString, onValidString]);

  return null;
};

const DashboardDispatchOrderCenter = () => {
  const [data, setData] = useState([]);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    quantity: '',
    message: '',
  });
  const [snackBarMessage, setSnackbarMessage] = useState('');
  const [snackBarSeverity, setSnackbarSeverity] = useState('');
  const [openSecondNotif, setOpenSecondNotif] = useState(false);
  const [loadingFullTable, setLoadingFullTable] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const location = useLocation();
  const { navigatePage, setPerPage, filters, columnFilters } = location.state || {};
  const { user } = useAuthContext();

  const handleCloseSecondNotif = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSecondNotif(false);
  };

  const { vertical, horizontal } = state;

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { id } = useParams();

  const fetchData = async () => {
    setLoadingTable(true);
    try {
      const { data } = await axiosInstance.get('/dispatch-center/get-order', {
        params: {
          order_number: parseInt(id),
        },
      });
      if (data.message == 'Dieser Auftrag wird im Dispatch Center nicht gefunden') {
        navigate('/dashboard/dispatch-center');
      }

      setData(data.order);
      setLoadingTable(false);
    } catch (error) {
      setLoadingTable(false);
      console.error('Error fetching data:', error);
    }
  };

  const handlePDFDownload2 = async (pdf, redirect) => {
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
            navigate('/dashboard/dispatch-center');
          }
        };
      } else {
        throw new Error('Failed to open new window');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handlePDFDownload = async (pdf, redirect) => {
    try {
      setLoadingFullTable(true);
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
      setLoadingFullTable(false);

      if (redirect) {
        iframe.contentWindow.onafterprint = () => {
          setTimeout(() => {
            document.body.removeChild(iframe);
            navigate('/dashboard/dispatch-center');
          }, 100);
        };
        setTimeout(() => {
          navigate('/dashboard/dispatch-center');
        }, 1000);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setLoadingFullTable(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({ ...state, open: false });
  };

  const handleBarcodeScan = async (barcode = '') => {
    try {
      const matchedBarcode = data?.order_line_items?.find((item) => item.barcode === searchTerm);

      const response = await axiosInstance.get('/dispatch-center/scan-product', {
        params: {
          order_id: data?.id,
          barcode: barcode != '' ? barcode : matchedBarcode.barcode,
        },
      });
      const pdf = response?.data?.pdf;
      const quantity = response?.data?.quantity;
      const message = response?.data?.message;
      setState({ ...state, open: true, quantity: quantity, message: message });
      if (pdf) {
        handlePDFDownload(pdf, true);
      } else {
        notification(message, true);
      }
      fetchData();
      if (response?.data?.status === 'completed') {
        setTimeout(() => {
          setIsOrderCompleted(true);
        }, 1000);
      }
      setSearchTerm('');
    } catch (error) {
      setState({ ...state, open: false });
      console.error('Error scanning barcode:', error);
    }
  };

  const handleBarcodeUnscan = async (barcode = '') => {
    try {
      const response = await axiosInstance.post('/dispatch-center/unscan-product', {
        order_id: data?.id,
        barcode: barcode != '' ? barcode : matchedBarcode.barcode,
      });

      notification(response.data.message, true);
      fetchData();
    } catch (error) {
      notification('Error scanning barcode:', false);
      console.error('Error scanning barcode:', error);
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f3f4f6',
      color: theme.palette.common.black,
      paddingTop: '0',
      paddingBottom: '0',
      textAlign: 'left',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const goBack = () => {
    const newLocation = {
      ...location,
      pathname: `/dashboard/dispatch-center/`,
    };
    navigate(newLocation, {
      state: {
        navigatePage: navigatePage,
        setPerPage: setPerPage,
        filters: filters,
        columnFilters: columnFilters,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="xentral-container">
      <ScannerListener
        onValidString={handleBarcodeScan}
        data={data}
        setOpen={setOpenSecondNotif}
        setSnackbarSeverity={setSnackbarSeverity}
        setSnackbarMessage={setSnackbarMessage}
        goBack={goBack}
      />
      <ScannerDetectorDispatch goBack={goBack} />
      <div className="mb-7 flex flex-[1.5] justify-between rounded-lg border bg-white px-4 py-5 shadow">
        <div className="flex w-full items-center">
          <button
            onClick={goBack}
            className="focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625 mr-3 box-border rounded-lg  border border-gray-300 p-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
          >
            Zurück
          </button>
        </div>
        {/* <div>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleBarcodeScan("");
                        }}
                    >
                        <Input
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Scan product"
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search"
                            onClick={() => handleBarcodeScan("")}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </div> */}
      </div>
      {(isOrderCompleted || data?.status == 'completed') && data?.tracking_number ? (
        <div className="mb-7 flex gap-3 bg-red-500 p-3">
          <svg
            className="h-[24px] w-[24px]"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 50 50"
          >
            <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"></path>
          </svg>{' '}
          Dieser Auftrag ist bereits erfüllt
        </div>
      ) : null}
      <div className="mb-7 flex flex-[1.5] justify-between rounded-lg border bg-white px-4 py-5 shadow">
        <div className="flex w-full flex-col items-start">
          <Typography variant="p" component="p" fontWeight="bold">
            Bestellung:{' '}
            <Link
              target="_blank"
              to={`https://admin.shopify.com/store/pummmys/orders/${data?.shopify_order_id}`}
            >
              {data?.order_name}
            </Link>
          </Typography>
          <Typography variant="p" component="p" fontWeight="bold">
            Kunde: {data?.costumer}
          </Typography>
          <Typography variant="p" component="p" fontWeight="bold">
            Adresse:{' '}
            {`${data?.shipping_address_address1} ${data?.shipping_address_address2}, ${data?.shipping_address_zip} ${data?.shipping_address_city}, ${data?.shipping_address_country}`}
          </Typography>
          {data?.tracking_number && data?.status == 'completed' && (
            <Typography variant="p" component="div" fontWeight="bold">
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
        </div>
      </div>

      <div className="mb-7 flex-[1.5] rounded-lg border bg-white px-4 py-5 shadow">
        <div className="w-full">
          <div>
            <DispatchCenterCustomTable
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

      <Stack className="bg-button" spacing={2} sx={{ width: '100%' }}>
        <Snackbar
          sx={{
            '& .MuiPaper-root': {
              color: '#fff',
              backgroundColor: snackBarSeverity == 'error' ? '#ff7373' : 'rgb(74, 222, 128)',
              padding: '20px',
            },
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSecondNotif}
          autoHideDuration={6000}
          onClose={handleCloseSecondNotif}
        >
          <Alert severity={snackBarSeverity}>
            {state.message ? state.message : snackBarMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
};
export default DashboardDispatchOrderCenter;
