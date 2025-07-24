import FilterListIcon from '@mui/icons-material/FilterList';
import { Chip, Collapse, Switch, Typography } from '@mui/material';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { orderColumns } from '../../../context/ordersColumns';
import axiosInstance from '../../../utils/axios';
import { OrdersTable } from '../OrdersTable/OrdersTable';
import { OrdersFormContent } from '../OrdersFormContent/OrdersFormContent';
import DownloadCSVButton from '../../atoms/DownloadCSVButton/DownloadCSVButton';
import PermissionCheck from '../PermissionCheck/PermissionCheck';
import { IconX } from '@tabler/icons-react';

// Reusable button component
const ActionButtons = ({ handleReset, onSubmit }) => (
  <div className="my-5 flex justify-end gap-4">
    <div onClick={handleReset} className="btn btn-secondary">
      Alle zurücksetzen
    </div>
    <button className="btn btn-primary" onClick={onSubmit}>
      Speichern Sie
    </button>
  </div>
);

export const OrdersTabContent = ({
  orders,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  fetchOrders,
  fetchOrdersFromStore,
  resetFilters,
  loading,
  setFetchedOrders,
  filters,
  setFilters,
  loadingTable,
  loadingFullTable,
  setRowsPerPage,
  rowsPerPage,
  setSaveQueryTable,
  saveQueryTable,
  monitor,
  onCheckboxChange,
  setPage,
  page,
  setSaveTableParam,
  saveTableParam,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [tags1, setTags1] = useState([]);
  const [tagInputValue1, setTagInputValue] = useState('');
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState({ startDate: null, endDate: null });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [incomingStock, setIncomingStock] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [statusMethod, setStatusMethod] = useState([]);
  const [checkboxState, setCheckboxState] = useState({
    barcode_exclude: false,
    barcode_strict: false,
  });
  const [clickedCheckbox, setClickedCheckbox] = useState('');
  const [columnFilters, setColumnFilters] = useState({});
  const [filtersApplied, setFiltersApplied] = useState(false);

  const handleCheckboxChange = (name) => (event) => {
    setCheckboxState((prevState) => ({
      barcode_exclude: name === 'barcode_exclude' ? event.target.checked : false,
      barcode_strict: name === 'barcode_strict' ? event.target.checked : false,
    }));
    setClickedCheckbox(event.target.checked ? name : '');
  };

  const handleDeleteMonitor = () => setSelectedMonitor(null);
  const handleClearAddress = () => setSelectedAddress(null);
  const handleClearIncomingStock = () => setIncomingStock(null);
  const handleClearPaymentMethod = () => setPaymentMethod(null);
  const handleClearShippingMethod = () => setShippingMethod(null);
  const handleClearStatusMethod = (value) =>
    setStatusMethod(statusMethod.filter((status) => status.value !== value));
  const handleArticleChange = (selectedOptions) => setSelectedArticles(selectedOptions);
  const handleTagDelete = (value) =>
    setSelectedArticles(selectedArticles.filter((article) => article.value !== value));
  const handleClearDateRange = () => {
    setSelectedDateRange({ startDate: null, endDate: null });
    setStartDate(null);
    setEndDate(null);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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

  const filterOptions = (options, { inputValue }) => {
    const flattenOptions = Array.isArray(options) ? options : [options];
    const flattenedArray = flattenOptions.flatMap((option) => {
      if (option && option.label) {
        return [option];
      } else if (option && option.options && Array.isArray(option.options)) {
        return option.options.filter((subOption) => subOption && subOption.label);
      }
      return [];
    });

    return flattenedArray.filter(
      (option) => option && option.label && option.label.includes(inputValue),
    );
  };

  const loadSuggestions = debounce(async (inputValue, callback) => {
    try {
      if (inputValue.length >= 3) {
        const response = await axiosInstance.get(`/picklist/get-items?keywords=${inputValue}`);
        if (response.data.items) {
          const groupedOptions = response.data.items.reduce((acc, item) => {
            const { product_name, title, barcode_number, shopify_variant_id } = item;
            const uniqueValue = `${barcode_number}`; // Unique identifier
            const groupIndex = acc.findIndex((group) => group.label === product_name);
            if (groupIndex !== -1) {
              acc[groupIndex].options.push({ value: uniqueValue, label: title });
            } else {
              acc.push({ label: product_name, options: [{ value: uniqueValue, label: title }] });
            }
            return acc;
          }, []);
          setOptions(groupedOptions);
          callback(groupedOptions);
        } else {
          setOptions([]);
          callback([]);
        }
      } else {
        setOptions([]);
        callback([]);
      }
    } catch (error) {
      console.error('API Error:', error);
      setOptions([]);
      callback([]);
    }
  }, 300);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleReset = () => {
    reset();
    setValue('items', null);
    setValue('tags', null);
    setValue('shippingMethod', null);
    setValue('paymentMethod', null);
    setValue('addressFilter', null);
    setValue('filter_address', null);
    setValue('incoming_stock', null);
    setValue('filter_monitor', null);
    setValue('status', null);
    setSelectedArticles([]);
    setStartDate(null);
    setEndDate(null);
    fetchOrders(true, `page=${page + 1}&paginate=${rowsPerPage}&monitor=${monitor}`);
    setSelectedStatus(false);
    resetFilters();
    setTags1([]);
    setSaveQueryTable(null);
    setShippingMethod(null);
    setPaymentMethod(null);
    setIncomingStock(null);
    setSelectedMonitor(null);
    setSelectedAddress(null);
    setSelectedDateRange({ startDate: null, endDate: null });
    setStatusMethod([]);
    setColumnFilters({});
    setShowFilters(false);
    setFilters((prevFilters) => ({
      ...prevFilters,
      filterDate: false,
    }));
    setFiltersApplied(false);
  };

  const buildQueryString = () => {
    const queryParams = Object.entries({
      ...(filters.filterDate && {
        start_date: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
        end_date: endDate ? dayjs(endDate).format('YYYY-MM-DD') : '',
      }),
      shipping_method: shippingMethod?.value || '',
      payment: paymentMethod?.value || '',
      barcode: selectedArticles?.map((item) => item?.value).join(',') || '',
      tags: tags1?.join(',') || '',
      tag_exclude: checkboxState.tag_exclude,
      barcode_exclude: checkboxState.barcode_exclude,
      payment_exclude: checkboxState.payment_exclude,
      shipping_method_exclude: checkboxState.shipping_method_exclude,
      date_exclude: checkboxState.date_exclude,
      status_exclude: checkboxState.status_exclude,
      filter_address: selectedAddress?.value,
      incoming_stock: incomingStock?.value,
      filter_monitor: selectedMonitor?.value,
      barcode_strict: checkboxState.barcode_strict,
      page: 1,
      paginate: rowsPerPage,
      monitor: monitor,
    })
      .filter(([_, value]) => value !== undefined && value !== '' && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);

    const statusParams =
      statusMethod?.map((status) => `statuses[]=${encodeURIComponent(status.value)}`) || [];

    return [...queryParams, ...statusParams].join('&');
  };

  const onSubmit = async (data) => {
    data.tags = tags1?.join(',');

    const onlyCompletedSelected =
      statusMethod?.length === 1 && statusMethod[0].value === 'completed';
    if (onlyCompletedSelected) {
      setSelectedStatus(true);
    } else {
      setSelectedStatus(false);
    }

    setPage(0);

    const includeQuery = true;
    const queryTable = buildQueryString();
    setSaveQueryTable(queryTable);
    fetchOrders(includeQuery, queryTable + saveTableParam);
    setShowFilters(false);
    setFiltersApplied(true);
  };

  const handleTagInputChange1 = (value) => {
    setTagInputValue(value);
  };

  const handleTagInputKeyDown1 = (key) => {
    if (key === 'Enter' && tagInputValue1.trim() !== '') {
      setTags1([...tags1, tagInputValue1.trim()]);
      setTagInputValue('');
    }
  };

  const handleTagDelete1 = (tagToDelete) => {
    setTags1(tags1.filter((tag) => tag !== tagToDelete));
  };

  const handleSwitchButtonClick = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      filterDate: true,
    }));
  };

  useEffect(() => {
    if (
      tags1.length == 0 &&
      selectedArticles.length == 0 &&
      !selectedDateRange.startDate &&
      !selectedDateRange.endDate &&
      !selectedAddress &&
      !selectedMonitor &&
      !incomingStock &&
      !paymentMethod &&
      !shippingMethod &&
      statusMethod.length == 0
    ) {
      handleReset();
    }
  }, [
    selectedArticles.length == 0,
    selectedDateRange.startDate,
    selectedDateRange.endDate,
    selectedAddress,
    incomingStock,
    selectedMonitor,
    tags1.length == 0,
    statusMethod.length == 0,
    shippingMethod,
    paymentMethod,
  ]);

  return (
    <div className="mb-4 pt-4">
      <div className="mb-4 flex items-center justify-between border bg-white px-4 py-4">
        <div>
          <PermissionCheck>
            <button disabled={loading} onClick={fetchOrdersFromStore} className="btn btn-primary">
              {loading ? 'Laden...' : 'Synchronisieren/Abrufen von Bestellungen aus dem Geschäft'}
            </button>
          </PermissionCheck>
        </div>
        <div className="flex items-center justify-around gap-6">
          <div className="flex items-center pl-3">
            <Typography>Monitor</Typography>
            <Switch type="checkbox" checked={monitor} onChange={onCheckboxChange} />
          </div>
          <DownloadCSVButton
            text="Download CSV"
            endpoint="order/get-orders-csv"
            query={`?${buildQueryString()}`}
            fileName="orders"
            disabled={orders?.orders?.data.length === 0}
          />
          <div
            className={'btn ' + (showFilters ? 'btn-primary' : 'btn-secondary')}
            onClick={toggleFilters}
          >
            {showFilters ? 'Filter ausblenden' : 'Filter einblenden'}
          </div>
        </div>
      </div>

      {showFilters && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4 bg-white">
          <Collapse in={showFilters} timeout="auto" unmountOnExit>
            <div className="border bg-white p-4">
              <OrdersFormContent
                tags1={tags1}
                control={control}
                errors={errors}
                startDate={startDate}
                endDate={endDate}
                filters={filters}
                updateFilters={updateFilters}
                selectedArticles={selectedArticles}
                selectedAddress={selectedAddress}
                selectedMonitor={selectedMonitor}
                paymentMethod={paymentMethod}
                shippingMethod={shippingMethod}
                statusMethod={statusMethod}
                incomingStock={incomingStock}
                tagInputValue1={tagInputValue1}
                options={options}
                filterOptions={filterOptions}
                handleArticleChange={handleArticleChange}
                clickedCheckbox={clickedCheckbox}
                checkboxState={checkboxState}
                handleCheckboxChange={handleCheckboxChange}
                loadSuggestions={loadSuggestions}
                handleTagInputKeyDown1={handleTagInputKeyDown1}
                setTags1={setTags1}
                setSelectedDateRange={setSelectedDateRange}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setSelectedAddress={setSelectedAddress}
                setSelectedMonitor={setSelectedMonitor}
                setPaymentMethod={setPaymentMethod}
                setStatusMethod={setStatusMethod}
                setShippingMethod={setShippingMethod}
                setIncomingStock={setIncomingStock}
                handleTagInputChange1={handleTagInputChange1}
              />
              <ActionButtons handleReset={handleReset} onSubmit={onSubmit} />
            </div>
          </Collapse>
        </form>
      )}

      {filtersApplied && !showFilters && (
        <div className="col-span-2 mb-4 bg-white p-4 shadow">
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-3 pb-4">
              {tags1.length > 0 && (
                <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
                  Search tags:
                  <div className="flex flex-wrap gap-2 divide-x font-medium">
                    {tags1.map((tag, index) => (
                      <span className="pl-2 pr-1" key={`tYJ3bb4kG-${index}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                    onClick={() => {
                      setTags1([]);
                    }}
                  >
                    <IconX size={20} />
                  </button>
                </div>
              )}
              {selectedArticles.length > 0 && (
                <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
                  Artikel::
                  <div className="flex flex-wrap gap-2 divide-x font-medium">
                    {selectedArticles.map(({ value, label }) => (
                      <span className="pl-2 pr-1" key={`tYJ3bb4kG-${value}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                  <button
                    className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                    onClick={() => {
                      setSelectedArticles([]);
                    }}
                  >
                    <IconX size={20} />
                  </button>
                </div>
              )}

              {selectedDateRange?.startDate !== null && selectedDateRange?.endDate !== null ? (
                <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
                  Datum der Bestellung:
                  <span className="px-2 font-medium">
                    {dayjs(selectedDateRange.startDate).format('DD.MM.YYYY')}
                  </span>{' '}
                  -
                  <span className="pl-2 font-medium">
                    {dayjs(selectedDateRange.endDate).format('DD.MM.YYYY')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                      onClick={() => {
                        setSelectedDateRange({ startDate: null, endDate: null });
                        setStartDate(null);
                        setEndDate(null);
                      }}
                    >
                      <IconX size={20} />
                    </button>
                  </div>
                </div>
              ) : null}

              {selectedAddress && (
                <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
                  Address filtern:
                  <span className="px-2 font-medium">{selectedAddress.label}</span>
                  <button
                    className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                    onClick={() => {
                      setSelectedAddress(null);
                    }}
                  >
                    <IconX size={20} />
                  </button>
                </div>
              )}
              {selectedMonitor && (
                <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
                  Filterbestand:
                  <span className="px-2 font-medium">{selectedMonitor.label}</span>
                  <button
                    className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                    onClick={() => {
                      setSelectedMonitor(null);
                    }}
                  >
                    <IconX size={20} />
                  </button>
                </div>
              )}
              {incomingStock && (
                <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
                  Eingehender Bestand:
                  <span className="px-2 font-medium">{incomingStock.label}</span>
                  <button
                    className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                    onClick={() => {
                      setIncomingStock(null);
                    }}
                  >
                    <IconX size={20} />
                  </button>
                </div>
              )}

              {paymentMethod && (
                <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
                  Zahlungsmethode:
                  <span className="px-2 font-medium">{paymentMethod.label}</span>
                  <button
                    className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                    onClick={() => {
                      setPaymentMethod(null);
                    }}
                  >
                    <IconX size={20} />
                  </button>
                </div>
              )}

              {statusMethod.length > 0 && (
                <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
                  Status:
                  <div className="flex flex-wrap gap-2">
                    {statusMethod.map(({ value, label }, index) => (
                      <span className="px-2 font-medium">{label}</span>
                    ))}
                    <button
                      className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                      onClick={() => {
                        setStatusMethod([]);
                      }}
                    >
                      <IconX size={20} />
                    </button>
                  </div>
                </div>
              )}

              {shippingMethod && (
                <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
                  VersandartShipping:
                  <span className="px-2 font-medium">{shippingMethod.label}</span>
                  <button
                    className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                    onClick={() => {
                      setShippingMethod(null);
                    }}
                  >
                    <IconX size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <ActionButtons handleReset={handleReset} onSubmit={onSubmit} />
        </div>
      )}

      <OrdersTable
        rows={orders || []}
        columns={orderColumns}
        fetchOrders={fetchOrders}
        setFetchedOrders={setFetchedOrders}
        filters={filters}
        setFilters={setFilters}
        selectedStatus={selectedStatus}
        setRowsPerPage={setRowsPerPage}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        page={page}
        saveQueryTable={saveQueryTable}
        loadingTable={loadingTable}
        loadingFullTable={loadingFullTable}
        setSaveTableParam={setSaveTableParam}
        saveTableParam={saveTableParam}
        setColumnFilters={setColumnFilters}
        columnFilters={columnFilters}
        monitor={monitor}
      />
    </div>
  );
};
