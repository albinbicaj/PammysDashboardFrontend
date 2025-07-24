import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Alert,
  Box,
  Collapse,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import { CloseOrderIcon, EditOrderIcon } from '../../atoms';
import { EditProductModal, QuantityProductsModal } from '../../organisms';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';
import CopyToClipboard from 'react-copy-to-clipboard';
import CustomPaginationXentral from '../CustomPagination/CustomPaginationXentral';
import PermissionCheck from '../PermissionCheck/PermissionCheck';
import { RoleEnum } from '../../../enums/Role.enum';
import showToast from '../../../hooks/useToast';
import { useForm } from 'react-hook-form';

import DownloadCSVButton from '../../atoms/DownloadCSVButton/DownloadCSVButton';
export const ProductsTable = ({
  rows,
  columns,
  setRows,
  fetchProducts,
  fetchProductsFromStore,
  loading,
  loadingTable,
  setLoadingTable,
  setLoadingFullTable,
  loadingFullTable,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openRows, setOpenRows] = useState([]);
  const [columnFilters, setColumnFilters] = useState({});
  const [saving, setSaving] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [quantityToUpdate, setQuantityToUpdate] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [calculationState, setCalculationState] = useState(false);
  const [file, setFile] = useState(null);
  const [storageLocations, setStorageLocations] = useState({});
  const [weightLocations, setWeightLocations] = useState({});
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [incomingStockModal, setIncomingStockModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reservedStockValues, setReservedStockValues] = useState({});
  const [saveFullQuery, setSaveFullQuery] = useState();
  const [productId, setProductId] = useState('');
  const [isCheckboxError, setIsCheckboxError] = useState(false);
  const [incomingStockState, setIncomingStockState] = useState({
    barcode: '',
    productVariantId: '',
    variantId: '',
    title: '',
    newId: '',
  });
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    message: '',
  });
  const [filters, setFilters] = useState({
    filterDate: false,
    sortBy: 'asc',
    sortWith: '',
    paymentMethod: [],
  });

  const {
    formState: { errors },
    control,
    getValues,
    reset,
  } = useForm();

  const navigate = useNavigate();

  const { vertical, horizontal } = state;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({ ...state, open: false });
  };

  const handleQuantityChange = (productId, action) => {
    setCurrentProductId(productId);
    setCalculationState(action === 'plus');
    setOpenModal(true);
  };

  const validateCheckboxes = () => {
    const values = getValues();
    const isValid = values.shopify || values.db;
    setIsCheckboxError(!isValid);
    return isValid;
  };

  const handleModalSave = async () => {
    // if (!validateCheckboxes()) {
    //   setIsCheckboxError(true);
    //   return;
    // }

    try {
      setSaving(true);
      const data = {
        shopify_variant_id: currentProductId,
        adjustment_type: calculationState ? 'add' : 'subtract',
        quantity: quantityToUpdate,
        update_target:
          getValues('shopify') && getValues('db')
            ? 'both'
            : getValues('shopify')
              ? 'shopify'
              : 'db',
      };

      await axiosInstance.post('/product/adjust-quantity', data);
      showToast('Menge erfolgreich angepasst', 'success');
      fetchProducts(saveFullQuery);
      setOpenModal(false);
      setIsCheckboxError(false);
      reset({
        shopify: false,
        db: false,
      });
      setQuantityToUpdate(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = (row) => {
    setIsModalOpen2(true);
    setProductId(row?.id);
  };

  const handleUnlimitedStockToggle = async (row) => {
    try {
      // setLoadingTable(true);

      await axiosInstance
        .put('/product/unlimited-stock', {
          id: row?.id,
          unlimited: !row?.unlimited_check,
        })
        .then((res) => {
          if (res.status === 200) {
            showToast('Produkte stock updated', 'success');
            fetchProducts();
          }
        });
    } catch (error) {
      console.error('Error:', error);
      showToast('Error occured', 'failure');
    }
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
    setOpenRows([]);
    fetchData(0, rowsPerPage); // Fetch data with new filters
  };

  const fetchData = async (newPage, newRowsPerPage) => {
    try {
      let filtersQuery = `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;
      const query = `?page=${newPage + 1}&paginate=${newRowsPerPage}` + filtersQuery;
      const filterParams = new URLSearchParams(columnFilters).toString();
      const fullQuery = query + (filterParams ? `&${filterParams}` : '');
      setSaveFullQuery(fullQuery);
      const data = await fetchProducts(fullQuery);
      const updatedRows = data;
      setPage(newPage);
      setOpenRows([]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChangePage = async (event, newPage) => {
    if (newPage < 0 || newPage >= rows.products.last_page) {
      return;
    }
    await fetchData(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    await fetchData(0, newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
  };

  const toggleRow = (rowId) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(rowId)
        ? prevOpenRows.filter((id) => id !== rowId)
        : [...prevOpenRows, rowId],
    );
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
    fetchData(0, rowsPerPage); // Fetch data with new sorting
  };

  const handleUpload = async () => {
    setLoadingCSV(true);
    setLoadingTable(true);
    setLoadingFullTable(true);
    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('csv_file', file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      setStorageLocations({});

      const response = await axiosInstance
        .post('/product/bulk-edit-product', formData, config)
        .then(() => {
          setLoadingCSV(false);
          fetchProducts();
          setFile(null);
          showToast('Produkte erfolgreich aktualisiert', 'success');
        });
      console.log('response', response);
    } catch (error) {
      setLoadingCSV(false);
      console.error('Error:', error);
      showToast(error?.response?.data?.message, 'failure');
      setLoadingTable(false);
      setLoadingFullTable(false);
    } finally {
      setLoadingTable(false);
      setLoadingFullTable(false);
    }
  };

  const handleInputChange = async (shopifyVariantId, rowId, event) => {
    const inputValue = event.target.value;

    setStorageLocations((prevLocations) => ({
      ...prevLocations,
      [rowId]: inputValue,
    }));

    if (event.key === 'Enter') {
      const data = {
        shopify_variant_id: shopifyVariantId,
        storage_location: inputValue,
      };

      try {
        const response = await axiosInstance.post('/product/adjust-location', data);

        if (response?.status === 200) {
          showToast(response?.data?.message, 'success');
        }
      } catch (error) {
        console.error('Error while making API call:', error);
      }
    }
  };

  const handleWeightInputChange = async (shopifyVariantId, rowId, event, row) => {
    const inputValue = event.target.value;

    setWeightLocations((prevLocations) => ({
      ...prevLocations,
      [rowId]: inputValue,
    }));

    if (event.key === 'Enter') {
      const data = {
        weight: inputValue,
        title: row?.title,
        sku: row?.sku,
        barcode_number: row?.barcode_number,
        weight_unit: row?.weight_unit,
        storage_location: row?.storage_location,
        physical_stock: row.physical_stock ? row.physical_stock : 0,
      };

      try {
        const response = await axiosInstance.put(`/product/edit-product/${shopifyVariantId}`, data);

        if (response?.status === 200) {
          showToast('Erfolgreich', 'success');
        }
      } catch (error) {
        console.error('Error while making API call:', error);
      }
    }
  };

  const handleIncomingStock = (row) => {
    setIncomingStockModal(false);
    setIsModalOpen(true);
    setIncomingStockState({
      barcode: row?.barcode_number || '',
      productVariantId: row?.id || '',
      variantId: row?.shopify_variant_id || '',
      title: row?.title || '',
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIncomingStockModal(false);
  };

  const handleCloseModal2 = () => {
    setIsModalOpen2(false);
  };

  const handleIncomingStockDelete = async (id) => {
    const { data } = await axiosInstance.delete(`/incoming-stock/show/${id}`);
  };

  const handleCopy = (text) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  const handleReservedStockUpdate = async (row, updatedValue) => {
    try {
      const data = {
        shopify_variant_id: row.shopify_variant_id,
        reserved_stock: updatedValue,
      };
      const response = await axiosInstance.post('/product/reserved-stock-update', data);
      if (response.data.success === 'Reserved stock updated') {
        showToast(response.data.success, 'success');
      }
    } catch (error) {
      console.error('Error updating reserved stock:', error);
      showToast(null, 'failure');
    }
  };

  const handleIncomingStockModal = async (item) => {
    try {
      setIsModalOpen(true);
      const { data } = await axiosInstance.get(`/incoming-stock/show/${item?.id}`);
      const incomingStockData = data.stock;
      setIncomingStockState({
        barcode: incomingStockData.barcode_number || '',
        productVariantId: incomingStockData.product_variant_id || '',
        variantId: incomingStockData.variant_id || '',
        title: incomingStockData.title || '',
        newId: incomingStockData.id || '',
      });
      setIncomingStockModal(true);
    } catch (error) {
      console.error('Error fetching incoming stock:', error);
      setIncomingStockModal(false);
    }
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [columnFilters, page, rowsPerPage, filters]);

  return (
    <>
      <div className="flex items-center justify-between border bg-white px-4 py-4">
        <div className="flex">
          <PermissionCheck roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.SUPPORT]}>
            <div className="ml-4 flex items-center gap-3">
              <Typography variant="span" component="span" fontWeight="bold">
                CSV-DATEI:
              </Typography>
              <label for="file-upload" className="custom-file-upload rounded-lg">
                {loadingCSV
                  ? 'Hochgeladen werden...'
                  : file
                    ? file.name + ' datei hochgeladen'
                    : 'CSV hier hochladen'}
              </label>
              <input
                className="ml-2 w-[52%]"
                id="file-upload"
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              <Tooltip placement="top" title={!file ? 'Datei hochladen' : null}>
                <button
                  className={`${!file ? 'cursor-not-allowed' : 'cursor-pointer'} btn btn-primary`}
                  onClick={handleUpload}
                  disabled={!file}
                >
                  {loadingCSV ? 'Laden...' : 'Einreichen'}
                </button>
              </Tooltip>
            </div>
          </PermissionCheck>
        </div>
        <div className="flex gap-2">
          <PermissionCheck roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.SUPPORT]}>
            <Link to="/dashboard/products/stock-update-logs">
              <button className="btn btn-secondary">Stock Logs</button>
            </Link>
          </PermissionCheck>
          <PermissionCheck
            roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.SUPPORT, RoleEnum.IEM]}
          >
            <DownloadCSVButton
              text={'Download Commited'}
              endpoint={'/product/get-product-varinats-supply-csv'}
              fileName={'CommitedProducts'}
              disabled={rows?.length === 0}
            />
          </PermissionCheck>
          <PermissionCheck roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.SUPPORT]}>
            <DownloadCSVButton
              text={'Download CSV'}
              endpoint={'/product/get-product-varinats-csv'}
              fileName={'Products'}
              disabled={rows?.length === 0}
            />
          </PermissionCheck>
          {/* <PermissionCheck>
              <button
                disabled={loading}
                onClick={fetchProductsFromStore}
                className="btn btn-primary mr-4 cursor-pointer"
              >
                {loading ? 'Laden...' : 'Synchronisieren/Abrufen von Produkten aus Shopify'}
              </button>
            </PermissionCheck> */}
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ height: '80px' }}>
              {columns?.map((column) => (
                <TableCell
                  sx={{
                    padding: '0px',
                    width: `${column.width}`,
                  }}
                  key={column.field}
                  className="custom-header"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex w-[80%] items-center justify-between">
                      <span
                        style={{
                          width: `${column.width}`,
                          margin: '0px',
                        }}
                        className="text-xs12 font-bold text-black"
                      >
                        {column.headerName}
                      </span>
                      {column.field !== 'expand_action' &&
                        column.field !== 'actions' &&
                        column.field != 'unlimited_check' && (
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
                    {column.field != 'expand_action' &&
                      column.field != 'actions' &&
                      column.field != 'unlimited_check' && (
                        <input
                          type="text"
                          placeholder={`Filter ${column.headerName}`}
                          value={columnFilters[column.field] || ''}
                          onChange={(e) => handleFilterChange(column, e.target.value)}
                          className="w-[80%] rounded-lg border border-gray-300 pl-2 "
                        />
                      )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingTable ? (
              <TableRow className="">
                <TableCell colSpan={columns.length}>
                  <div
                    className={`${loadingFullTable && 'absolute bottom-0 left-0 right-0 top-0 z-[1] h-full bg-white bg-opacity-50'}  flex h-16 items-center justify-center`}
                  >
                    <PammysLoading />
                  </div>
                </TableCell>
              </TableRow>
            ) : rows?.products?.data?.length == 0 ? (
              <TableRow className="">
                <TableCell colSpan={columns.length}>
                  <div className="flex h-16 items-center justify-center">
                    <Typography variant="body2" align="center" padding={2}>
                      Keine Daten verfügbar
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {rows?.products?.data?.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                          width: '50px',
                        }}
                      >
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(row.id)}
                        >
                          {openRows.includes(row.id) ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>

                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                          paddingLeft: '0',
                        }}
                        align="left"
                      >
                        <CopyToClipboard
                          text={row.barcode_number}
                          onCopy={() => handleCopy(row.barcode_number)}
                        >
                          <Tooltip title={copied ? 'Copied!' : 'Copy to Clipboard'} placement="top">
                            <span className="block max-w-[200px] cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap">
                              {row.barcode_number}
                            </span>
                          </Tooltip>
                        </CopyToClipboard>
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                          paddingLeft: '0',
                        }}
                        align="left"
                      >
                        <CopyToClipboard text={row.sku} onCopy={() => handleCopy(row.sku)}>
                          <Tooltip title={copied ? 'Copied!' : 'Copy to Clipboard'} placement="top">
                            <span className="block max-w-[200px] cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap">
                              {row.sku}
                            </span>
                          </Tooltip>
                        </CopyToClipboard>
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                          paddingLeft: '0',
                        }}
                        align="left"
                      >
                        {row.product_title}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                          paddingLeft: '0',
                        }}
                        align="left"
                      >
                        {row?.reserved_stock ? row?.reserved_stock : 0}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                          paddingLeft: '0',
                        }}
                        align="left"
                      >
                        {row?.physical_stock ? row?.physical_stock : 0}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {row?.picklist_stock}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {row?.reserved_picklist_stock}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        <span
                          className="cursor-pointer p-1"
                          onClick={() => handleUnlimitedStockToggle(row)}
                        >
                          <Switch type="checkbox" checked={row?.unlimited_check} />
                          {/* {row?.unlimited_check} */}
                        </span>
                      </TableCell>

                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        <PermissionCheck
                          roles={[RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.WAREHOUSE_EMPLOYEE]}
                        >
                          <span
                            className="cursor-pointer p-1"
                            onClick={() => handleEditProduct(row)}
                          >
                            <EditOrderIcon />
                          </span>
                        </PermissionCheck>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                        <Collapse in={openRows.includes(row.id)} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1, paddingTop: 1, paddingBottom: 1 }}>
                            <Typography variant="p" gutterBottom component="p" fontWeight="bold">
                              Lagerhaus
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Produkt</StyledTableCell>
                                  <StyledTableCell>Menge</StyledTableCell>
                                  <StyledTableCell>Regal</StyledTableCell>
                                  <StyledTableCell>Gewicht</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableCell>{row?.title}</TableCell>
                                <TableCell>
                                  <PermissionCheck
                                    roles={[
                                      RoleEnum.ADMIN,
                                      RoleEnum.SUPPORT,
                                      RoleEnum.WAREHOUSE_EMPLOYEE,
                                    ]}
                                  >
                                    <span
                                      className="inline-flex w-3 cursor-pointer  items-center justify-center"
                                      onClick={() =>
                                        handleQuantityChange(row?.shopify_variant_id, 'minus')
                                      }
                                    >
                                      -
                                    </span>
                                  </PermissionCheck>
                                  {row?.physical_stock ? row?.physical_stock : 0}
                                  <PermissionCheck
                                    roles={[
                                      RoleEnum.ADMIN,
                                      RoleEnum.SUPPORT,
                                      RoleEnum.WAREHOUSE_EMPLOYEE,
                                    ]}
                                  >
                                    <span
                                      className="inline-flex w-4 cursor-pointer  items-center justify-center"
                                      onClick={() =>
                                        handleQuantityChange(row?.shopify_variant_id, 'plus')
                                      }
                                    >
                                      +
                                    </span>
                                  </PermissionCheck>
                                </TableCell>
                                <TableCell>
                                  <input
                                    className="input h-[26px] border-gray-300 pl-2"
                                    type="text"
                                    value={
                                      storageLocations[row.id] === undefined
                                        ? row?.storage_location
                                        : storageLocations[row.id]
                                    }
                                    onChange={(event) =>
                                      handleInputChange(row?.shopify_variant_id, row.id, event)
                                    } // Pass row.id to the handleInputChange function
                                    onKeyPress={(event) =>
                                      handleInputChange(row?.shopify_variant_id, row.id, event)
                                    } // Pass row.id to the handleInputChange function
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="relative w-fit">
                                    <input
                                      className="input h-[26px] border-gray-300 pl-2"
                                      type="text"
                                      value={
                                        weightLocations[row.id] === undefined
                                          ? row?.weight
                                          : weightLocations[row.id]
                                      }
                                      onChange={(event) =>
                                        handleWeightInputChange(
                                          row?.shopify_variant_id,
                                          row.id,
                                          event,
                                          row,
                                        )
                                      } // Pass row.id to the handleInputChange function
                                      onKeyPress={(event) =>
                                        handleWeightInputChange(
                                          row?.shopify_variant_id,
                                          row.id,
                                          event,
                                          row,
                                        )
                                      }
                                    />
                                    <span className="absolute right-2 top-[1px]">
                                      {row?.weight_unit}
                                    </span>
                                  </div>
                                </TableCell>
                              </TableBody>
                            </Table>
                            <div className="mt-4 flex items-center  gap-4">
                              <div className="flex items-center gap-2">
                                {/* <Typography variant="p" component="p">
                                  Lagerbestand:{row?.physical_stock ? row?.physical_stock : 0} |
                                </Typography>
                                <div className="flex items-center gap-3">
                                  Offene Aufträge:
                                  <input
                                    type="number"
                                    className="input w-28"
                                    value={
                                      reservedStockValues[row.id] !== undefined
                                        ? reservedStockValues[row.id]
                                        : row?.reserved_stock || 0
                                    }
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedValues = {
                                        ...reservedStockValues,
                                        [row.id]: newValue,
                                      };
                                      setReservedStockValues(updatedValues);
                                    }}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleReservedStockUpdate(row, reservedStockValues[row.id]);
                                      }
                                    }}
                                  />
                                </div>{' '}
                                | */}
                                <Typography variant="p" component="p">
                                  Shopify Menge:
                                  <span className="font-bold"> {row?.shopify_quantity}</span>
                                </Typography>
                              </div>
                              <Link
                                className="btn btn-secondary ml-auto cursor-pointer"
                                to={`/dashboard/products/stock-update-logs?sku=${encodeURIComponent(row?.sku)}`}
                              >
                                Check Stock Logs
                              </Link>
                              <button
                                className="btn btn-primary cursor-pointer"
                                onClick={() => handleIncomingStock(row)}
                              >
                                Eingehender Bestand
                              </button>
                            </div>
                          </Box>

                          {row?.incoming_stock.length > 0 && (
                            <Box sx={{ margin: 1, paddingTop: 1, paddingBottom: 1 }}>
                              <Typography variant="p" gutterBottom component="p" fontWeight="bold">
                                Eingehender Bestand
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <StyledTableCell>Titel</StyledTableCell>
                                    <StyledTableCell>Bestellte Menge</StyledTableCell>
                                    <StyledTableCell>Angekommen</StyledTableCell>
                                    <StyledTableCell>Fehlende Menge</StyledTableCell>
                                    <StyledTableCell>Aktion</StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {row?.incoming_stock.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item?.title}</TableCell>
                                      <TableCell>{item?.ordered_quantity}</TableCell>
                                      <TableCell>{item?.arrived_quantity}</TableCell>
                                      <TableCell>{item?.missing_quantity}</TableCell>
                                      <TableCell
                                        sx={{
                                          paddingTop: '0',
                                          paddingBottom: '0',
                                        }}
                                        align="left"
                                      >
                                        <div className="flex">
                                          <span
                                            className="flex cursor-pointer items-center justify-start pl-1 pr-2"
                                            onClick={() => handleIncomingStockModal(item)}
                                          >
                                            <EditOrderIcon />
                                          </span>
                                          <span
                                            className="flex cursor-pointer items-center justify-start "
                                            onClick={() => handleIncomingStockDelete(item.id)}
                                          >
                                            <CloseOrderIcon />
                                          </span>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          )}
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <QuantityProductsModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        calculationState={calculationState}
        setIsCheckboxError={setIsCheckboxError}
        reset={reset}
        quantityToUpdate={quantityToUpdate}
        setQuantityToUpdate={setQuantityToUpdate}
        control={control}
        validateCheckboxes={validateCheckboxes}
        isCheckboxError={isCheckboxError}
        saving={saving}
        handleModalSave={handleModalSave}
      />

      <EditProductModal
        open={isModalOpen2}
        handleClose={handleCloseModal2}
        fetchProducts={fetchProducts}
        productId={productId}
        saveFullQuery={saveFullQuery}
      />
      {/* <div className="flex items-center justify-center">
        <div className=" mr-auto flex items-center">
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={rows?.products.total || 0}
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
        total={rows?.products?.total || 0}
        handlePageChange={handleChangePage}
        handlePageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
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
          open={state.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert severity={'success'}>
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
                <p className={`relative top-[-6px] text-lg text-white`}>Erfolgreich!</p>
                {state?.message && <h2 className={`text-sm text-white `}>{state?.message}</h2>}
              </div>
            </div>
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
};
