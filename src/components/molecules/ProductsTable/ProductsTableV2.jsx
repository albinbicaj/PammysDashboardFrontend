import { useState } from 'react';
import axiosInstance from '../../../utils/axios';
import showToast from '../../../hooks/useToast';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import useGlobalDragDetection from '../../../hooks/useGlobalDragDetection';
import { useDiscounts } from '../../../apiHooks/useOrders';
import ProductsTableV2UI from './ProductsTableV2UI';
export const ProductsTableV2 = ({
  filters: filtersV2 = {},
  updateFilters: updateFiltersV2 = () => {},
  queryString: queryStringUseQuery = '',
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
  const isDraggingFile = useGlobalDragDetection();
  const [openRows, setOpenRows] = useState([]);
  // const [columnFilters, setColumnFilters] = useState({});
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
  // const [reservedStockValues, setReservedStockValues] = useState({});
  // const [saveFullQuery, setSaveFullQuery] = useState();
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
  // const [filters, setFilters] = useState({
  //   filterDate: false,
  //   sortBy: 'asc',
  //   sortWith: '',
  //   paymentMethod: [],
  // });

  const {
    formState: { errors },
    control,
    getValues,
    reset,
  } = useForm();
  const { isLoading, refetch } = useDiscounts();
  const handleFetchDiscounts = () => {
    refetch();
  };

  // const { vertical, horizontal } = state;

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
      fetchProducts();
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

  // const handleFilterChange = (column, value) => {
  //   setColumnFilters((prevFilters) => {
  //     if (value === '') {
  //       const { [column.field]: omit, ...restFilters } = prevFilters;
  //       return restFilters;
  //     }
  //     return {
  //       ...prevFilters,
  //       [column.field]: value,
  //     };
  //   });
  //   setPage(0);
  //   setOpenRows([]);
  // };

  // const fetchData = async (newPage, newRowsPerPage) => {
  //   try {
  //     let filtersQuery = `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;
  //     const query = `?page=${newPage + 1}&paginate=${newRowsPerPage}` + filtersQuery;
  //     const filterParams = new URLSearchParams(columnFilters).toString();
  //     const fullQuery = query + (filterParams ? `&${filterParams}` : '');
  //     setSaveFullQuery(fullQuery);
  //     const data = await fetchProducts(fullQuery);
  //     const updatedRows = data;
  //     setPage(newPage);
  //     setOpenRows([]);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // const handleChangePage = async (event, newPage) => {
  //   if (newPage < 0 || newPage >= rows.products.last_page) {
  //     return;
  //   }
  //   await fetchData(newPage, rowsPerPage);
  // };

  // const handleChangeRowsPerPage = async (event) => {
  //   const newRowsPerPage = parseInt(event.target.value, 10);
  //   await fetchData(0, newRowsPerPage);
  //   setRowsPerPage(newRowsPerPage);
  // };

  const toggleRow = (rowId) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(rowId)
        ? prevOpenRows.filter((id) => id !== rowId)
        : [...prevOpenRows, rowId],
    );
  };

  // const updateFilters = (fieldsToUpdate) => {
  //   setFilters((prevContext) => {
  //     let updatedContext = { ...prevContext };
  //     for (const [key, value] of Object.entries(fieldsToUpdate)) {
  //       updatedContext[key] = value;
  //     }
  //     return updatedContext;
  //   });
  // };

  // const handleSortBy = (sort) => {
  //   if (filters.sortBy === sort.sortBy && filters.sortWith === sort.sortWith) {
  //     updateFilters({ sortBy: 'asc', sortWith: '' });
  //   } else {
  //     updateFilters(sort);
  //   }
  //   setPage(0);
  // };

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

  function formatStorageLocation(value) {
    if (!value) return '';
    const numericValue = value.toString().replace(/\D/g, '').substring(0, 6);
    let formattedValue = numericValue;
    if (numericValue.length > 2) {
      formattedValue = `${numericValue.substring(0, 2)}.${numericValue.substring(2, 4)}`;
      if (numericValue.length > 4) {
        formattedValue += `.${numericValue.substring(4, 6)}`;
      }
    }
    return formattedValue;
  }

  const handleInputChange = async (shopifyVariantId, rowId, event) => {
    let inputValue = event.target.value.replace(/\D/g, '').substring(0, 6); // Remove non-digit characters and limit to 6 digits
    console.log('Input Value:', inputValue); // Debugging log

    // Format the input value with dots for display
    let formattedInputValue = inputValue;
    if (inputValue.length > 2) {
      formattedInputValue = inputValue.substring(0, 2) + '.' + inputValue.substring(2, 4);
      if (inputValue.length > 4) {
        formattedInputValue = formattedInputValue + '.' + inputValue.substring(4, 6);
      }
    }
    console.log('Formatted Input Value:', formattedInputValue); // Debugging log

    // Update the state with the formatted value
    setStorageLocations((prevLocations) => ({
      ...prevLocations,
      [rowId]: formattedInputValue,
    }));

    // If the Enter key is pressed, send the numeric value to the backend
    if (event.key === 'Enter') {
      const data = {
        shopify_variant_id: shopifyVariantId,
        storage_location: inputValue, // Send the numeric value without dots
      };
      console.log('Data to be sent:', data); // Debugging log
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIncomingStockModal(false);
  };

  const handleCloseModal2 = () => {
    setIsModalOpen2(false);
  };

  const handleCopy = (text) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(file);
        console.log(file);
      }
    },
    multiple: false,
    accept: {
      // 'image/jpeg': ['.jpeg', '.png'],
      'text/csv': ['.csv'],
    },
  });

  return (
    <ProductsTableV2UI
      isDraggingFile={isDraggingFile}
      getRootProps={getRootProps}
      isDragAccept={isDragAccept}
      isDragReject={isDragReject}
      isDragActive={isDragActive}
      loadingCSV={loadingCSV}
      file={file}
      getInputProps={getInputProps}
      setFile={setFile}
      handleUpload={handleUpload}
      rows={rows}
      filtersV2={filtersV2}
      updateFiltersV2={updateFiltersV2}
      loadingTable={loadingTable}
      toggleRow={toggleRow}
      columns={columns}
      openRows={openRows}
      handleCopy={handleCopy}
      handleEditProduct={handleEditProduct}
      handleQuantityChange={handleQuantityChange}
      storageLocations={storageLocations}
      formatStorageLocation={formatStorageLocation}
      handleInputChange={handleInputChange}
      handleWeightInputChange={handleWeightInputChange}
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
      open={open}
      handleClose={handleClose}
      incomingStockModal={incomingStockModal}
      fetchProducts={fetchProducts}
      incomingStockState={incomingStockState}
      isModalOpen2={isModalOpen2}
      handleCloseModal2={handleCloseModal2}
      productId={productId}
      state={state}
      copied={copied}
      weightLocations={weightLocations}
      queryStringUseQuery={queryStringUseQuery}
    />
  );
};
