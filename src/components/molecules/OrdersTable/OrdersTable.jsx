import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Alert,
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  Modal,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  styled,
  tableCellClasses,
  Typography,
  Chip,
} from '@mui/material';
import dayjs from 'dayjs';
import queryString from 'query-string';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckMark,
  CreateTrackingNumber,
  EditOrderIcon,
  ShippingOrderIcon,
  StockOrderIcon,
} from '../../atoms';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../../utils/axios';
import { checkAvailability } from '../../../utils/checkAvailability';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';
import CustomPaginationXentral from '../CustomPagination/CustomPaginationXentral';
import showToast from '../../../hooks/useToast';
import { SingleOrderPicklistButton } from '../../atoms/SingleOrderPicklistButton/SingleOrderPicklistButton';

export const OrdersTable = ({
  rows,
  columns,
  fetchOrders,
  setFilters,
  filters,
  selectedStatus,
  rowsPerPage,
  setRowsPerPage,
  setPage,
  page,
  saveQueryTable,
  loadingTable,
  loadingFullTable,
  setSaveTableParam,
  saveTableParam,
  setColumnFilters,
  columnFilters,
  monitor,
}) => {
  // console.log('TABLE ORDERS TABLE ROWS:', rows);
  const navigate = useNavigate();
  const location = useLocation();
  const [openRows, setOpenRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [skipAddressValidation, setSkipAddressValidation] = useState(0);
  const [costumerUpdate, setCostumerUpdate] = useState(false);
  const [snackBarMessage, setSnackbarMessage] = useState('');
  const [snackBarSeverity, setSnackbarSeverity] = useState('');
  const [open, setOpen] = useState(false);
  const [saveQuery, setSaveQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = rows?.orders?.data?.reduce(
    (sum, row) => sum + parseFloat(row?.amount || 0),
    0,
  );
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
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
    // fetchOrders(
    //   true,
    //   saveTableParam +
    //     '&' +
    //     saveQueryTable +
    //     `&page=${1}&paginate=${rowsPerPage}&monitor=${monitor}`,
    // );
  };

  const handleChangePage = async (event, newPage) => {
    if (newPage < 0 || newPage >= rows.last_page) {
      return;
    }
    setPage(newPage);
    await fetchData(newPage, rowsPerPage);
  };

  const handleFilterChange = (column, value) => {
    setColumnFilters((prevFilters) => ({
      ...prevFilters,
      [column.field]: value,
    }));
    const queryParams = queryString.parse(location.search);
    const updatedQueryParams = { ...queryParams };

    if (value.trim() !== '') {
      updatedQueryParams[column.field] = value;
    } else {
      delete updatedQueryParams[column.field];
    }

    const queryStringParams = queryString.stringify(updatedQueryParams);
    const queryTableParam = value.trim() !== '' ? `&${column.field}=${value}` : '';
    setSaveTableParam(queryTableParam);

    const cleanedQuery = removePageAndPaginate(saveQueryTable);
    setPage(0);

    fetchOrders(
      true,
      queryStringParams +
        '&' +
        cleanedQuery +
        `&page=${1}&paginate=${rowsPerPage}&monitor=${monitor}`,
    );
  };

  const updateOrder = (row) => {
    reset({
      country: row?.country,
      shipping_address_country: row?.shipping_address_country,
      first_name: row?.shipping_address_first_name,
      last_name: row?.shipping_address_last_name,
      address1: row?.shipping_address_address1,
      address2: row?.shipping_address_address2,
      city: row?.shipping_address_city,
      zip: row?.shipping_address_zip,
      company: row?.shipping_address_company,
      country_code: row?.country_code,
      order_shopify_id: row?.shopify_order_id,
      costumer_update: row?.costumer_update,
      // skip_address_validation: row?.skip_address_validation,
    });
    setSkipAddressValidation(row?.skip_address_validation);
    setCostumerUpdate(row?.costumer_update);
    setOpenModal(true);
  };

  const toggleRow = (rowId) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(rowId)
        ? prevOpenRows.filter((id) => id !== rowId)
        : [...prevOpenRows, rowId],
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchData(0, newRowsPerPage);
  };

  const fetchData = async (newPage, newRowsPerPage) => {
    try {
      setPage(newPage);
      const cleanedQuery = removePageAndPaginate(saveQueryTable);
      const query =
        cleanedQuery + `&page=${newPage + 1}&paginate=${newRowsPerPage}&monitor=${monitor}`;
      setSaveQuery(query);
      await fetchOrders(true, query + saveTableParam);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#e0e0e0',
      color: theme.palette.common.black,
      paddingTop: '0',
      paddingBottom: '0',
      textAlign: 'left',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const removePageAndPaginate = (query) => {
    if (query) {
      return query
        .replace(/&?paginate=\d+/, '') // Remove paginate parameter
        .replace(/&?page=\d+/, '') // Remove page parameter
        .replace(/&?monitor=\d+/, ''); // Remove page parameter
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    data.skip_address_validation = skipAddressValidation ? 1 : 0;
    data.costumer_update = costumerUpdate ? true : false;
    try {
      console.log('function triggered');
      const response = await axiosInstance.post('order/update-shipping-address', data);
      console.log('THI GETS EXECUTED ONLY ON 200');
      if (response?.data?.error) {
        // // setSkipAddressValidation(false);
      } else {
        // setSnackbarMessage('Adresse erfolgreich aktualisiert');
        // setSnackbarSeverity('error');
        // setOpenModal(false);
        // setOpen(true);
        // // setSkipAddressValidation(false);
      }
      showToast('Adresse erfolgreich aktualisiert', 'success');
      console.log('patload:', response);
      console.log('patload:', response.status);
      // setSnackbarMessage('Adresse erfolgreich aktualisiert');
      // setSnackbarSeverity('error');
      // setOpenModal(false);
      // setOpen(true);

      const cleanedQuery = removePageAndPaginate(saveQueryTable);
      fetchOrders(
        true,
        `page=${page + 1}&paginate=${rowsPerPage}&${cleanedQuery}&monitor=${monitor}${saveTableParam}`,
      );
    } catch (error) {
      showToast(error?.response?.data?.message, 'failure');
      // setSnackbarMessage(error?.response?.data?.message);
      // setSnackbarSeverity('error');
      // setOpenModal(false);
      // setOpen(true);

      console.error('Error submitting form:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
    } finally {
      setOpenModal(false);
      setIsLoading(false);
      setSkipAddressValidation(false);
      setCostumerUpdate(false);
    }
  };

  const handlePDFDownload = async (pdf) => {
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

  const getStatusBadgeData = (status) => {
    const lowerCaseStatus = status.trim().toLowerCase();
    switch (lowerCaseStatus) {
      case 'completed':
        return { classes: 'bg-green-200 text-green-700', text: 'Abgeschlossen' };
      case 'open':
        return { classes: 'bg-purple-200 text-purple-600', text: 'Offen' };
      case 'canceled':
        return { classes: 'bg-red-200 text-red-600', text: 'Abgebrochen' };
      case 'in_progress':
        return { classes: 'bg-yellow-200 text-yellow-700', text: 'In Bearbeitung' };
      default:
        return { classes: '', text: '' };
    }
  };

  return (
    <>
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full border-collapse border bg-white text-sm">
          <thead className="border-b">
            <tr>
              {columns.map((column, index) => (
                <th
                  className="custom-header text-gray px-3 py-2"
                  key={`IkicnkoF-${index}`}
                  style={{
                    width: column.width,
                    borderRight:
                      column.field === 'expand_action' || column.field === 'filter_monitor'
                        ? 'none'
                        : '1px solid #e5e7eb',
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex w-[90%] items-center justify-between">
                      <span
                        style={{
                          width: `${column.width}`,
                        }}
                        className="m-[0px] text-xs12 font-bold text-black"
                      >
                        {column.headerName}
                      </span>
                      {column.field !== 'expand_action' &&
                        column.field !== 'actions' &&
                        column.field !== 'filter_monitor' && (
                          <div className="cursor-pointer">
                            <div
                              className={
                                filters.sortBy === 'desc' && filters.sortWith === column.field
                                  ? 'rounded-md bg-accent text-black'
                                  : ''
                              }
                              onClick={() =>
                                handleSortBy({
                                  sortBy: 'desc',
                                  sortWith: column.field,
                                })
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div
                              className={
                                filters.sortBy === 'asc' && filters.sortWith === column.field
                                  ? 'rounded-md bg-accent text-black'
                                  : ''
                              }
                              onClick={() =>
                                handleSortBy({
                                  sortBy: 'asc',
                                  sortWith: column.field,
                                })
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                    </div>
                    {column.field !== 'expand_action' &&
                      column.field !== 'actions' &&
                      column.field !== 'amount' &&
                      column.field !== 'filter_monitor' && (
                        <input
                          type="text"
                          placeholder={`Filter ${column.headerName}`}
                          value={columnFilters[column.field] || ''}
                          onChange={(e) => handleFilterChange(column, e.target.value)}
                          className="w-[90%] rounded-lg border border-gray-300 pl-2"
                        />
                      )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loadingTable ? (
              <tr>
                <td colSpan={columns.length}>
                  <div
                    className={`${loadingFullTable && 'absolute bottom-0 left-0 right-0 top-0 z-[1] h-full bg-white bg-opacity-50'}  flex h-16 items-center justify-center`}
                  >
                    <PammysLoading />
                  </div>
                </td>
              </tr>
            ) : rows?.orders?.length <= 0 || rows?.orders?.data.length <= 0 ? (
              <tr className="">
                <td colSpan={12}>
                  <div className="flex h-16 items-center justify-center">
                    <Typography variant="body2" align="center" padding={2}>
                      Keine Daten verfügbar
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : (
              rows?.orders?.data?.map((row) => (
                <React.Fragment key={row.id}>
                  <tr>
                    {columns?.map((column, index) => (
                      <td
                        className="bg-[#F7F7F7] pl-0 pr-0"
                        key={column.field}
                        style={{
                          width: column.width,
                          backgroundColor:
                            selectedStatus || (row?.status === 'completed' && '#F7F7F7'),
                        }}
                      >
                        {column.field === 'expand_action' && (
                          <div
                            onClick={() => toggleRow(row.id)}
                            className="cursor-pointer px-1 py-2.5"
                          >
                            <IconButton aria-label="expand row" size="small">
                              {openRows.includes(row.id) ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </div>
                        )}
                        {column.field === 'order_name' && (
                          <Link
                            target="_blank"
                            to={`https://admin.shopify.com/store/pummmys/orders/${row.shopify_order_id}`}
                          >
                            {row[column.field]}
                          </Link>
                        )}
                        {column.field === 'actions' && (
                          <div
                            className='pl-0" pb-0 pr-1 pt-0'
                            style={{
                              backgroundColor:
                                selectedStatus || (row?.status === 'completed' && '#F7F7F7'),
                            }}
                            align="right"
                          >
                            <span className="flex items-center">
                              {/* THIS BUTTON IS DEPRECATED  */}
                              {/* {!row?.tracking_number && row?.status === 'completed' && (
                                <Tooltip title="Tracking-Nummer erstellen" placement="top">
                                  <span
                                    className="cursor-pointer"
                                    onClick={() => createTrackingNumber(row?.id)}
                                  >
                                    <CreateTrackingNumber />
                                  </span>
                                </Tooltip>
                              )} */}
                              <span className="cursor-pointer p-1" onClick={() => updateOrder(row)}>
                                <EditOrderIcon />
                              </span>
                            </span>
                          </div>
                        )}
                        {column.field === 'status' && (
                          <div
                            className="pb-0 pl-0 pr-1 pt-0"
                            style={{
                              backgroundColor:
                                selectedStatus || (row?.status === 'completed' && '#F7F7F7'),
                            }}
                          >
                            {(() => {
                              const statusData = getStatusBadgeData(row[column.field]);
                              return (
                                <div className={`badge w-max ${statusData.classes}`}>
                                  {statusData.text}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                        {column.field === 'tags' && (
                          <div
                            className="pb-0 pl-0 pr-1 pt-0"
                            style={{
                              backgroundColor:
                                selectedStatus || (row?.status === 'completed' && '#F7F7F7'),
                            }}
                          >
                            <div className="flex flex-wrap gap-1">
                              {(() => {
                                try {
                                  const tags = JSON.parse(row[column.field]);
                                  return Array.isArray(tags)
                                    ? tags.map((tag, index) =>
                                        tag ? (
                                          <div
                                            key={index}
                                            className="badge w-max bg-gray-200 text-gray-600"
                                          >
                                            {tag}
                                          </div>
                                        ) : (
                                          <div key={index}>-</div>
                                        ),
                                      )
                                    : row[column.field];
                                } catch (e) {
                                  return row[column.field];
                                }
                              })()}
                            </div>
                          </div>
                        )}
                        {column.field === 'amount' && (
                          <div
                            className="pb-0 pl-0 pr-1 pt-0"
                            style={{
                              backgroundColor:
                                selectedStatus || (row?.status === 'completed' && '#F7F7F7'),
                            }}
                          >
                            {new Intl.NumberFormat('de-DE', {
                              style: 'currency',
                              currency: 'EUR',
                            }).format(row[column.field])}
                          </div>
                        )}
                        {column.field === 'filter_monitor' && (
                          <div
                            style={{
                              backgroundColor:
                                selectedStatus || (row?.status === 'completed' && '#F7F7F7'),
                            }}
                            align="right"
                            className={`${selectedStatus ? 'Test' : 'test1'} pb-0 pl-0  pt-0`}
                          >
                            <span className="flex items-center gap-2">
                              {row?.status === 'completed' ? (
                                <>
                                  <div className="flex h-[26px] items-center justify-center rounded-md bg-gray-300 pl-1 pr-[5px]">
                                    <CheckMark />
                                  </div>
                                  <div className="flex h-[26px] items-center justify-center rounded-md bg-gray-300 pl-1 pr-[5px]">
                                    <CheckMark />
                                  </div>
                                </>
                              ) : (
                                <>
                                  {(monitor ||
                                    (column.field !== 'filter_monitor' &&
                                      column.field !== 'actions')) && (
                                    <div
                                      className={`flex h-[26px] items-center justify-center rounded-md ${
                                        checkAvailability(row?.order_line_items)
                                          ? 'bg-green-300'
                                          : 'bg-red-300'
                                      }  pl-1 pr-[5px]`}
                                    >
                                      <StockOrderIcon />
                                    </div>
                                  )}

                                  <div
                                    className={`${
                                      row?.shipping_address_correct === 0
                                        ? 'bg-red-300'
                                        : 'bg-green-300'
                                    } flex h-[26px] items-center justify-center rounded-md pl-1 pr-1`}
                                  >
                                    <ShippingOrderIcon />
                                  </div>
                                </>
                              )}
                            </span>
                          </div>
                        )}
                        {column.field === 'from' && (
                          <div
                            className="pb-0 pl-0 pt-0"
                            style={{
                              backgroundColor:
                                selectedStatus || (row?.status === 'completed' && '#F7F7F7'),
                            }}
                          >
                            {dayjs(row[column.field]).format('DD.MM.YYYY')}
                          </div>
                        )}
                        {column.field !== 'expand_action' &&
                          column.field !== 'actions' &&
                          column.field !== 'status' &&
                          column.field !== 'tags' &&
                          column.field !== 'amount' &&
                          column.field !== 'filter_monitor' &&
                          column.field !== 'order_name' &&
                          column.field !== 'from' && (
                            <div
                              className="pb-0 pl-0 pt-0"
                              style={{
                                backgroundColor:
                                  selectedStatus || (row?.status === 'completed' && '#F7F7F7'),
                              }}
                            >
                              {row[column.field] ? row[column.field] : '-'}
                            </div>
                          )}
                      </td>
                    ))}
                  </tr>

                  <TableRow>
                    <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                      <Collapse in={openRows.includes(row.id)} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, paddingTop: 1, paddingBottom: 1 }}>
                          <div className="flex w-full justify-between">
                            <div>
                              <Typography variant="p" gutterBottom component="p" fontWeight="bold">
                                Informationen für Kunden
                              </Typography>
                              <Typography variant="p" component="p">
                                <Typography variant="span" component="span" fontWeight="bold">
                                  Kunde:
                                </Typography>{' '}
                                {`${row?.costumer}`}
                              </Typography>
                              <Typography variant="p" component="p">
                                <Typography variant="span" component="span" fontWeight="bold">
                                  Adresse:
                                </Typography>{' '}
                                {row?.shipping_address_address1 && row?.shipping_address_address1}
                                {row?.shipping_address_address2 &&
                                  `, ${row?.shipping_address_address2}`}
                                {row?.shipping_address_zip && `, ${row?.shipping_address_zip}`}
                                {row?.shipping_address_city && ` ${row?.shipping_address_city}`}
                                {row?.shipping_address_country &&
                                  `, ${row?.shipping_address_country}`}{' '}
                              </Typography>
                              {row?.tracking_number && (
                                <Typography variant="p" component="p">
                                  <Typography variant="span" component="span" fontWeight="bold">
                                    Versandetikett:
                                  </Typography>
                                  <Tooltip
                                    title={
                                      !row?.shipping_label_download_url
                                        ? 'Das Versandetikett fehlt'
                                        : 'Download Versandetikett'
                                    }
                                    placement="top"
                                    arrow
                                  >
                                    <span
                                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                      onClick={() => {
                                        handlePDFDownload(row?.shipping_label_download_url);
                                      }}
                                    >
                                      {row?.tracking_number}
                                    </span>{' '}
                                  </Tooltip>
                                </Typography>
                              )}
                            </div>
                            <div>
                              <SingleOrderPicklistButton orderNumber={row?.order_name} />
                              {/* <button className="btn btn-secondary">
                                Generate Singe Order Picklist {row?.order_name}
                              </button> */}
                            </div>
                          </div>
                        </Box>
                        {row?.order_line_items && row.order_line_items.length > 0 && (
                          <Box sx={{ margin: 1, paddingTop: 1, paddingBottom: 1 }}>
                            <Typography variant="p" gutterBottom component="p" fontWeight="bold">
                              Produkt
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Artikel</StyledTableCell>
                                  <StyledTableCell>Barcode Nummer</StyledTableCell>
                                  <StyledTableCell>Gewicht</StyledTableCell>
                                  <StyledTableCell>Menge</StyledTableCell>
                                  <StyledTableCell>Vorräte auf Lager</StyledTableCell>
                                  <StyledTableCell>Kommissionierliste Bestand</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row?.order_line_items?.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item?.item}</TableCell>
                                    <TableCell>{item?.barcode}</TableCell>
                                    <TableCell>{item?.gewitch}</TableCell>
                                    <TableCell>{item?.quantity}</TableCell>
                                    <TableCell>
                                      {item.product_variant?.physical_stock || 0}
                                    </TableCell>
                                    <TableCell>
                                      {item.product_variant?.picklist_stock || 0}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        )}

                        {row.picked_by_user && row.picked_by_user.length != 0 && (
                          <Box sx={{ margin: 1, paddingTop: 1, paddingBottom: 1 }}>
                            <Typography variant="p" gutterBottom component="p" fontWeight="bold">
                              Picker
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell width="33%">Datum</StyledTableCell>
                                  <StyledTableCell width="33%">Name</StyledTableCell>
                                  <StyledTableCell width="33%">Nachname</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell width="33%">
                                    {dayjs(row?.picked_on).format('DD.MM.YYYY [um] HH:mm')}
                                  </TableCell>
                                  <TableCell width="33%">
                                    {row?.picked_by_user?.first_name}
                                  </TableCell>
                                  <TableCell width="33%">
                                    {row?.picked_by_user?.last_name}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        )}

                        {row.packed_by_user && row.packed_by_user.length != 0 && (
                          <Box sx={{ margin: 1, paddingTop: 1, paddingBottom: 1 }}>
                            <Typography variant="p" gutterBottom component="p" fontWeight="bold">
                              Packer
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell width="25%">Datum</StyledTableCell>
                                  <StyledTableCell width="25%">Name</StyledTableCell>
                                  <StyledTableCell width="25%">Nachname</StyledTableCell>
                                  <StyledTableCell width="25%">Status</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell width="25%">
                                    {dayjs(row?.packed_on).format('DD.MM.YYYY [um] HH:mm')}
                                  </TableCell>
                                  <TableCell width="25%">
                                    {row?.packed_by_user?.first_name}
                                  </TableCell>
                                  <TableCell width="25%">
                                    {row?.packed_by_user?.last_name}
                                  </TableCell>
                                  <TableCell width="25%">
                                    {row?.packed_by_user?.deleted_at ? (
                                      <span className="text-red-500">
                                        Worker deleted at{' '}
                                        {dayjs(row?.packed_by_user?.deleted_at).format(
                                          'DD.MM.YYYY',
                                        )}
                                      </span>
                                    ) : (
                                      <span className="text-green-500">Active worker</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        )}

                        {row.partially_picked_by_user &&
                          row.partially_picked_by_user.length != 0 && (
                            <Box sx={{ margin: 1, paddingTop: 1, paddingBottom: 1 }}>
                              <Typography variant="p" gutterBottom component="p" fontWeight="bold">
                                Teilweise vom Benutzer ausgewählt
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <StyledTableCell width="33%">Datum</StyledTableCell>
                                    <StyledTableCell width="33%">Name</StyledTableCell>
                                    <StyledTableCell width="33%">Nachname</StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell width="33%">
                                      {dayjs(row?.partially_picked_on).format(
                                        'DD.MM.YYYY [um] HH:mm',
                                      )}
                                    </TableCell>
                                    <TableCell width="33%">
                                      {row?.partially_picked_by_user?.first_name}
                                    </TableCell>
                                    <TableCell width="33%">
                                      {row?.partially_picked_by_user?.last_name}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          )}

                        {row.partially_packed_by_user &&
                          row.partially_packed_by_user.length != 0 && (
                            <Box sx={{ margin: 1, paddingTop: 1, paddingBottom: 1 }}>
                              <Typography variant="p" gutterBottom component="p" fontWeight="bold">
                                Teilweise vom Benutzer verpackt
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <StyledTableCell width="33%">Datum</StyledTableCell>
                                    <StyledTableCell width="33%">Name</StyledTableCell>
                                    <StyledTableCell width="33%">Nachname</StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell width="33%">
                                      {dayjs(row?.partially_packed_on).format(
                                        'DD.MM.YYYY [um] HH:mm',
                                      )}
                                    </TableCell>
                                    <TableCell width="33%">
                                      {row?.partially_picked_by_user?.first_name}
                                    </TableCell>
                                    <TableCell width="33%">
                                      {row?.partially_picked_by_user?.last_name}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          )}
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
            <tr>
              {columns?.map((column, index) => (
                <td
                  style={{
                    width: `${column.width}`,
                  }}
                  key={column.field}
                  className="custom-header px-2"
                >
                  {column.sortable ? (
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">{column?.headerName}</span>
                      <TableSortLabel />
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span
                        style={{
                          width: `${column?.width}`,
                        }}
                        className="m-0 text-xs12 font-bold text-black"
                      >
                        {column?.field === 'amount'
                          ? `Insgesamt: ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalAmount)}`
                          : column?.headerName}
                      </span>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* <div className="flex items-center justify-center">
        <div className=" mr-auto flex items-center">
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={rows?.orders?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Reihen pro Seite:"
          />
        </div>
      </div> */}

      <CustomPaginationXentral
        page={page}
        pageSize={rowsPerPage}
        total={rows?.orders?.total || 0}
        handlePageChange={handleChangePage}
        handlePageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      <Modal
        open={openModal}
        onBackdropClick={() => setOpenModal(false)}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-modal-description"
        sx={{ bgcolor: 'rgba(156, 163, 175, 0.75)' }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 620,
            bgcolor: '#ffffff',
            border: 'none',
            outline: 'none',
            p: 4,
            boxShadow: 24,
          }}
        >
          <div className=" mb-3 flex items-center justify-center">
            <p className="modal-title text-center text-xl font-bold">Adresse bearbeiten</p>
          </div>
          <p id="modal-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div>
                <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                  Land/Region
                </Typography>
                <Controller
                  name="shipping_address_country"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div>
                      <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Vornamen
                  </Typography>
                  <Controller
                    name="first_name"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                  <Controller
                    name="country_code"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input
                          className="hidden h-8 w-full rounded-md border pl-2 text-sm"
                          {...field}
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="order_shopify_id"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input
                          className="hidden h-8 w-full rounded-md border pl-2 text-sm"
                          {...field}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Nachname
                  </Typography>
                  <Controller
                    name="last_name"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                </div>
              </div>
              <div>
                <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                  Unternehmen
                </Typography>
                <Controller
                  name="company"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div>
                      <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                    </div>
                  )}
                />
              </div>
              <div>
                <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                  Straße und Hausnummer
                </Typography>
                <Controller
                  name="address1"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div>
                      <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                    </div>
                  )}
                />
              </div>
              <div>
                <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                  Zusätzliche Adresse
                </Typography>
                <Controller
                  name="address2"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div>
                      <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Postleitzahl
                  </Typography>
                  <Controller
                    name="zip"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Typography id="modal-modal-title" variant="p" component="p" fontSize="14px">
                    Stadt
                  </Typography>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div>
                        <input className="h-8 w-full rounded-md border pl-2 text-sm" {...field} />
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="flex-col items-center justify-between gap-3">
                <div>
                  <Controller
                    name="skip_address_validation"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            color="primary"
                            checked={skipAddressValidation}
                            onChange={(e) => setSkipAddressValidation(e.target.checked)}
                          />
                        }
                        label={<span className="text-[13px]">Drucken ohne Änderungen</span>}
                        sx={{ fontSize: '12px' }}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="costumer_update"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            color="primary"
                            checked={costumerUpdate}
                            onChange={(e) => setCostumerUpdate(e.target.checked)}
                          />
                        }
                        label={
                          <span className="text-[13px]">
                            Aktualisieren Sie die Adresse des Kunden auch in seinem Profil in
                            Shopify.
                          </span>
                        }
                        sx={{ fontSize: '12px' }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-center gap-5">
                <div onClick={() => setOpenModal(false)} className="btn btn-default cursor-pointer">
                  Abbrechen
                </div>
                <button className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Aktualisierung...' : 'Speichern Sie'}
                </button>
              </div>
            </form>
          </p>
        </Box>
      </Modal>

      <Stack className="bg-button" spacing={2} sx={{ width: '100%' }}>
        <Snackbar
          sx={{
            '& .MuiPaper-root': {
              color: '#fff',
              backgroundColor: 'rgb(74, 222, 128)',
              padding: '20px',
            },
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert severity={snackBarSeverity}>
            <div className="flex gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                color="#ffffff"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-rosette-discount-check"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
                <path d="M9 12l2 2l4 -4" />
              </svg>
              <div>
                <p className={`relative top-[-6px] text-lg text-white`}>Success!</p>
                {snackBarMessage}
              </div>
            </div>
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
};
