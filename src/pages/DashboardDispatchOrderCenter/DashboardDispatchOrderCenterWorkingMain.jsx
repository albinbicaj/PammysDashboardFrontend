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
import { DispatchCenterCustomTable, DispatchCenterCustomTableV2 } from '../../components/molecules';
import axiosInstance from '../../utils/axios';
import { notification } from '../../utils/notification';
import { useLocation } from 'react-router-dom';
import { RoleEnum } from '../../enums/Role.enum';

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
    console.log(e.key);
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

const DashboardDispatchOrderCenterWorkingMain = () => {
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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingTable(false);
    }
  };

  const handlePDFDownload2 = async (pdf, redirect = false) => {
    // Opens the PDF in a new browser tab or window using window.open().
    // This relies on the browser's built-in PDF viewer and does not involve DOM manipulation for embedding.
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

  const handlePDFDownload = async (pdf, redirect = false) => {
    // PDF Display Method
    // Creates an iframe to display the PDF.
    // Embeds the iframe into the DOM (#root) and uses iframe.contentWindow.print() to print the PDF.
    // The iframe's lifecycle is tied to the DOM; it is hidden and may be removed after printing or redirecting.
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

      if (redirect && data?.country !== 'Switzerland') {
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
    } finally {
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
      const pdf_customs_url = response?.data?.pdf_customs_url;
      const quantity = response?.data?.quantity;
      const message = response?.data?.message;
      setState({ ...state, open: true, quantity: quantity, message: message });
      if (pdf) {
        if (pdf_customs_url) {
          handlePDFDownload(pdf, false);
        } else {
          handlePDFDownload(pdf, true);
        }
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
      <div className="mb-7 flex justify-between gap-3     ">
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

      <div className="  ">
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
export default DashboardDispatchOrderCenterWorkingMain;

// MAIN CODE BACKUP
// import {
//   Alert,
//   Snackbar,
//   Stack,
//   TableCell,
//   Typography,
//   styled,
//   tableCellClasses,
// } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { DispatchCenterCustomTable, DispatchCenterCustomTableV2 } from '../../components/molecules';
// import axiosInstance from '../../utils/axios';
// import { notification } from '../../utils/notification';
// import { useLocation } from 'react-router-dom';
// import { RoleEnum } from '../../enums/Role.enum';

// import ScannerDetectorDispatch from '../../components/organisms/ScannerDetector/ScannerDetectorDispatch';

// const ScannerListener = ({
//   onValidString,
//   data,
//   setOpen,
//   setSnackbarSeverity,
//   setSnackbarMessage,
//   goBack,
// }) => {
//   const [typedString, setTypedString] = useState('');

//   const handleKeyPress = (e) => {
//     console.log(e.key);
//     if (e.key === 'Enter' && typedString.length > 2 && typedString != 'A1B2C3D4E5') {
//       const foundOrder = data?.order_line_items?.find((item) => item.barcode == typedString);
//       setTypedString('');
//       setOpen(true);
//       if (foundOrder) {
//         setSnackbarSeverity('success');
//         setSnackbarMessage('Success');
//         onValidString(typedString);
//       } else {
//         setSnackbarSeverity('error');
//         setSnackbarMessage(`Produkt nicht gefunden ${typedString}`);
//         return;
//       }
//     } else {
//       setTypedString((prevString) => prevString + e.key);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('keypress', handleKeyPress);
//     return () => {
//       window.removeEventListener('keypress', handleKeyPress);
//     };
//   }, [typedString, onValidString]);

//   return null;
// };

// const DashboardDispatchOrderCenterV2 = () => {
//   const [data, setData] = useState([]);
//   const [isOrderCompleted, setIsOrderCompleted] = useState(false);
//   const [state, setState] = useState({
//     open: false,
//     vertical: 'top',
//     horizontal: 'right',
//     quantity: '',
//     message: '',
//   });
//   const [snackBarMessage, setSnackbarMessage] = useState('');
//   const [snackBarSeverity, setSnackbarSeverity] = useState('');
//   const [openSecondNotif, setOpenSecondNotif] = useState(false);
//   const [loadingFullTable, setLoadingFullTable] = useState(false);
//   const [loadingTable, setLoadingTable] = useState(true);
//   const location = useLocation();
//   const { navigatePage, setPerPage, filters, columnFilters } = location.state || {};

//   const handleCloseSecondNotif = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSecondNotif(false);
//   };

//   const { vertical, horizontal } = state;

//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');

//   const { id } = useParams();

//   const fetchData = async () => {
//     setLoadingTable(true);
//     try {
//       const { data } = await axiosInstance.get('/dispatch-center/get-order', {
//         params: {
//           order_number: parseInt(id),
//         },
//       });
//       if (data.message == 'Dieser Auftrag wird im Dispatch Center nicht gefunden') {
//         navigate('/dashboard/dispatch-center');
//       }

//       setData(data.order);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoadingTable(false);
//     }
//   };

//   const handlePDFDownload2 = async (pdf, redirect) => {
//     try {
//       const base64String = pdf;
//       const base64StringSplit = base64String?.split(',')[1];

//       const byteCharacters = atob(base64StringSplit);
//       const byteNumbers = new Array(byteCharacters.length);

//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }

//       const byteArray = new Uint8Array(byteNumbers);
//       const blob = new Blob([byteArray], { type: 'application/pdf' });
//       const url = URL.createObjectURL(blob);

//       const newWindow = window.open(url, '_blank');
//       if (newWindow) {
//         newWindow.onload = () => {
//           newWindow.focus();
//         };

//         newWindow.onunload = () => {
//           URL.revokeObjectURL(url);
//           if (redirect) {
//             navigate('/dashboard/dispatch-center');
//           }
//         };
//       } else {
//         throw new Error('Failed to open new window');
//       }
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//     }
//   };

//   const handlePDFDownload = async (pdf, redirect) => {
//     try {
//       setLoadingFullTable(true);
//       const base64String = pdf;
//       const base64StringSplit = base64String?.split(',')[1];

//       const byteCharacters = atob(base64StringSplit);
//       const byteNumbers = new Array(byteCharacters.length);

//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }

//       const byteArray = new Uint8Array(byteNumbers);
//       const blob = new Blob([byteArray], { type: 'application/pdf' });
//       const url = URL.createObjectURL(blob);
//       let iframe = document.createElement('iframe');
//       iframe.style.visibility = 'hidden';
//       iframe.src = url;
//       const rootDiv = document.getElementById('root');
//       if (rootDiv) {
//         rootDiv.appendChild(iframe);
//       }
//       iframe.contentWindow.focus();
//       iframe.contentWindow.print();

//       if (redirect) {
//         iframe.contentWindow.onafterprint = () => {
//           setTimeout(() => {
//             document.body.removeChild(iframe);
//             navigate('/dashboard/dispatch-center');
//           }, 100);
//         };
//         setTimeout(() => {
//           navigate('/dashboard/dispatch-center');
//         }, 1000);
//       }
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//     } finally {
//       setLoadingFullTable(false);
//     }
//   };

//   const handleClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setState({ ...state, open: false });
//   };

//   const handleBarcodeScan = async (barcode = '') => {
//     try {
//       const matchedBarcode = data?.order_line_items?.find((item) => item.barcode === searchTerm);

//       const response = await axiosInstance.get('/dispatch-center/scan-product', {
//         params: {
//           order_id: data?.id,
//           barcode: barcode != '' ? barcode : matchedBarcode.barcode,
//         },
//       });
//       const pdf = response?.data?.pdf;
//       const quantity = response?.data?.quantity;
//       const message = response?.data?.message;
//       setState({ ...state, open: true, quantity: quantity, message: message });
//       if (pdf) {
//         handlePDFDownload(pdf, true);
//       } else {
//         notification(message, true);
//       }
//       fetchData();
//       if (response?.data?.status === 'completed') {
//         setTimeout(() => {
//           setIsOrderCompleted(true);
//         }, 1000);
//       }
//       setSearchTerm('');
//     } catch (error) {
//       setState({ ...state, open: false });
//       console.error('Error scanning barcode:', error);
//     }
//   };

//   const handleBarcodeUnscan = async (barcode = '') => {
//     try {
//       const response = await axiosInstance.post('/dispatch-center/unscan-product', {
//         order_id: data?.id,
//         barcode: barcode != '' ? barcode : matchedBarcode.barcode,
//       });

//       notification(response.data.message, true);
//       fetchData();
//     } catch (error) {
//       notification('Error scanning barcode:', false);
//       console.error('Error scanning barcode:', error);
//     }
//   };

//   const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//       backgroundColor: '#f3f4f6',
//       color: theme.palette.common.black,
//       paddingTop: '0',
//       paddingBottom: '0',
//       textAlign: 'left',
//     },
//     [`&.${tableCellClasses.body}`]: {
//       fontSize: 14,
//     },
//   }));

//   const goBack = () => {
//     const newLocation = {
//       ...location,
//       pathname: `/dashboard/dispatch-center/`,
//     };
//     navigate(newLocation, {
//       state: {
//         navigatePage: navigatePage,
//         setPerPage: setPerPage,
//         filters: filters,
//         columnFilters: columnFilters,
//       },
//     });
//   };

//   useEffect(() => {
//     fetchData();
//   }, [id]);

//   return (
//     <div className="xentral-container">
//       <ScannerListener
//         onValidString={handleBarcodeScan}
//         data={data}
//         setOpen={setOpenSecondNotif}
//         setSnackbarSeverity={setSnackbarSeverity}
//         setSnackbarMessage={setSnackbarMessage}
//         goBack={goBack}
//       />
//       <ScannerDetectorDispatch goBack={goBack} />
//       <div className="mb-7 flex justify-between gap-3     ">
//         <div className="flex ">
//           <button
//             onClick={goBack}
//             className="focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625 mr-3 box-border   border-2 border-gray-300 bg-gray-200 px-4 py-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
//           >
//             Zurück
//           </button>
//         </div>
//         <div className="  flex flex-1 justify-between border-2 bg-white p-4 ">
//           <div className="flex w-full flex-wrap items-start gap-12">
//             <Typography variant="p" component="p">
//               Bestellung:{' '}
//               <Link
//                 className="font-bold"
//                 target="_blank"
//                 to={`https://admin.shopify.com/store/pummmys/orders/${data?.shopify_order_id}`}
//               >
//                 {data?.order_name}
//               </Link>
//             </Typography>
//             <Typography variant="p" component="p">
//               Kunde: <span className="font-bold">{data?.costumer}</span>
//             </Typography>
//             <Typography variant="p" component="p">
//               Adresse:{' '}
//               <span className="font-bold">
//                 {`${data?.shipping_address_address1} ${data?.shipping_address_address2}, ${data?.shipping_address_zip} ${data?.shipping_address_city}, ${data?.shipping_address_country}`}
//               </span>
//             </Typography>
//             {data?.tracking_number && data?.status == 'completed' && (
//               <Typography variant="p" component="div">
//                 Versandetikett:{' '}
//                 <span
//                   style={{ cursor: 'pointer', textDecoration: 'underline' }}
//                   onClick={() => {
//                     if (data?.shipping_label_download_url) {
//                       handlePDFDownload2(data?.shipping_label_download_url, false);
//                     }
//                   }}
//                 >
//                   {data?.tracking_number}
//                 </span>
//               </Typography>
//             )}
//           </div>
//         </div>
//       </div>
//       {(isOrderCompleted || data?.status == 'completed') && data?.tracking_number ? (
//         <div className="mb-7 flex gap-3 bg-red-500 p-3">
//           <svg
//             className="h-[24px] w-[24px]"
//             xmlns="http://www.w3.org/2000/svg"
//             x="0px"
//             y="0px"
//             width="100"
//             height="100"
//             viewBox="0 0 50 50"
//           >
//             <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"></path>
//           </svg>{' '}
//           Dieser Auftrag ist bereits erfüllt
//         </div>
//       ) : null}

//       <div className="  ">
//         <div className="w-full">
//           <div>
//             <DispatchCenterCustomTableV2
//               data={data}
//               handleBarcodeScan={handleBarcodeScan}
//               handleBarcodeUnscan={handleBarcodeUnscan}
//               loadingTable={loadingTable}
//               loadingFullTable={loadingFullTable}
//             />
//           </div>
//         </div>
//       </div>
//       {!state.message && (
//         <Snackbar
//           open={state.open}
//           autoHideDuration={6000}
//           onClose={handleClose}
//           key={'top' + 'right'}
//           anchorOrigin={{ vertical, horizontal }}
//           sx={{
//             '& .MuiPaper-root': {
//               color: '#fff',
//               backgroundColor: 'rgb(74, 222, 128)',
//               padding: '20px',
//             },
//           }}
//         >
//           <Alert severity="success" variant="filled" sx={{ width: '400px' }}>
//             Produktmenge : {state?.quantity}
//           </Alert>
//         </Snackbar>
//       )}
//       <Stack className="bg-button" spacing={2} sx={{ width: '100%' }}>
//         <Snackbar
//           sx={{
//             '& .MuiPaper-root': {
//               color: '#fff',
//               backgroundColor: snackBarSeverity == 'error' ? '#ff7373' : 'rgb(74, 222, 128)',
//               padding: '20px',
//             },
//           }}
//           anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//           open={openSecondNotif}
//           autoHideDuration={6000}
//           onClose={handleCloseSecondNotif}
//         >
//           <Alert severity={snackBarSeverity}>
//             {state.message ? state.message : snackBarMessage}
//           </Alert>
//         </Snackbar>
//       </Stack>
//     </div>
//   );
// };
// export default DashboardDispatchOrderCenterV2;
