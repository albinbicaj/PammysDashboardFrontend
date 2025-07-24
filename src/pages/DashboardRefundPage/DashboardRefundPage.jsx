import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import axios from '../../utils/axios';
import useDocumentTitle from '../../components/useDocumentTitle';
import { refundColumns } from '../../data/tables/refundColumns';
import { CustomDatePicker, CustomSnackBar } from '../../components/molecules';
import dayjs from 'dayjs';
import { Chip, Box, Collapse } from '@mui/material';
import { FilterSearchBar } from '../../components/atoms';
import { CustomReturnsTable } from '../../components/molecules/CustomReturnsTable/CustomReturnsTable';
import { PaymentMethodFilter } from '../../components/molecules/PaymentMethodFilter/PaymentMethodFilter';
import showToast from '../../hooks/useToast';
import { ToggleFiltersButton } from '../../components/atoms/Buttons/ToggleFiltersButton';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';

const DashboardRefundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useDocumentTitle('Pammys Dashboard | Refunds');
  const [refunds, setRefunds] = useState([]);
  const [selectedForRefund, setSelectedForRefund] = useState([]);
  const [snackBar, setSnackBar] = useState(false);
  const [snackBarSeverity, setSnackbarSeverity] = useState('');
  const [refundMessage, setRefundMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [tags, setTags] = useState([]);
  const [searchTags, setSearchTags] = useState(tags.join(','));
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
      setSearchTags([...tags, inputValue.trim()].join(','));
    }
  };
  const handleTagDelete = (tagToDelete) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(updatedTags);
    setSearchTags(updatedTags.join(','));
  };

  const parsed = queryString.parse(location.search);
  const pageQueryParam = parseInt(parsed.page, 10);
  const pageSizeQueryParam = parseInt(parsed.pageSize, 10);
  const startDateQueryParam = parsed.startDate;
  const endDateQueryParam = parsed.endDate;
  const defaultStartDate = dayjs().subtract(1, 'month').toDate();

  const [filters, setFilters] = useState({
    filterOn: false,
    filterDate: false,
    sortBy: 'asc',
    sortWith: 'refund_created_at',
    paymentMethod: [],
  });

  const updateFilters = (fieldsToUpdate) => {
    setFilters((prevContext) => {
      let updatedContext = { ...prevContext };
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        updatedContext[key] = value;
      }
      return updatedContext;
    });
  };

  const [page, setPage] = useState(!isNaN(pageQueryParam) ? pageQueryParam : 1); // Default to page 1
  const [pageSize, setPageSize] = useState(!isNaN(pageSizeQueryParam) ? pageSizeQueryParam : 10); // Default to page size 10
  const [startDate, setStartDate] = useState(
    startDateQueryParam ? dayjs(startDateQueryParam).toDate() : defaultStartDate, // Use current date if startDateQueryParam is not present
  );
  const [endDate, setEndDate] = useState(
    endDateQueryParam ? dayjs(endDateQueryParam).toDate() : new Date(), // Use current date if endDateQueryParam is not present
  );
  const [searchText, setSearchText] = useState(parsed.searchText || '');

  const updateStartDateQueryParam = (newStartDate) => {
    setStartDate(newStartDate);
    const formattedStartDate = dayjs(newStartDate).format('YYYY-MM-DD');
    const updatedSearch = `page=${page}&pageSize=${pageSize}&startDate=${formattedStartDate}&endDate=${
      endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''
    }`;
    navigate(`?${updatedSearch}`);
  };

  const updateEndDateQueryParam = (newEndDate) => {
    setEndDate(newEndDate);
    const formattedEndDate = dayjs(newEndDate).format('YYYY-MM-DD');
    const updatedSearch = `page=${page}&pageSize=${pageSize}&startDate=${
      startDate ? dayjs(startDate).format('YYYY-MM-DD') : ''
    }&endDate=${formattedEndDate}`;
    navigate(`?${updatedSearch}`);
  };
  const updatePageQueryParam = (newPage) => {
    setPage(newPage);
    const updatedSearch = `page=${newPage}&per_page=${pageSize}`;
    navigate(`?${updatedSearch}`);
  };

  // Function to update the pageSize query parameter and state
  const updatePageSizeQueryParam = (newPageSize) => {
    setPageSize(newPageSize);
    const updatedSearch = `page=${page}&pageSize=${newPageSize}`;
    navigate(`?${updatedSearch}`);
  };
  const updateSearchTextQueryParam = (newSearchText) => {
    if (newSearchText.length > 1) {
      if (newSearchText[0] == '#') {
        newSearchText = newSearchText.substring(1); // Remove the first character
      }
    }
    setSearchText(newSearchText);
    const updatedSearch = `page=${page}&pageSize=${pageSize}&searchText=${encodeURIComponent(
      newSearchText,
    )}`;
    navigate(`?${updatedSearch}`);
  };
  const handleCheckboxChange = (event, row) => {
    const selectedIndex = selectedForRefund.indexOf(row.barcode_number);
    let newSelected = [...selectedForRefund];

    if (selectedIndex === -1) {
      newSelected.push(row.barcode_number);
    } else {
      newSelected.splice(selectedIndex, 1);
    }
    console.log('Selected rows: ', newSelected);
    // Step 2.1: Update the state with new selected rows
    setSelectedForRefund(newSelected);
  };

  const handleSelectAll = (event, row) => {
    const allRefundIds = refunds.map((refund) => refund.barcode_number);

    if (selectedForRefund.length === allRefundIds.length) {
      // All refunds are currently selected, remove them
      setSelectedForRefund([]);
    } else {
      // Some or none of the refunds are selected, add all refund IDs
      setSelectedForRefund(allRefundIds);
    }
  };
  const fetchRefunds = async () => {
    setLoading(true);
    const response = await axios
      .get(
        `/dashboard/refunds?` +
          `page=${page}` +
          `&pagination=${pageSize}` +
          `${searchText?.length > 0 ? `&search=${searchText}` : ''}` +
          `${searchTags?.length > 0 && filters.filterOn === true ? `&tags=${searchTags}` : ''}` +
          `${
            filters.filterDate
              ? `${startDate !== '' ? `&start_date=${dayjs(startDate).format('YYYY-MM-DD')}` : ''}` +
                `${endDate !== '' ? `&end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : ''}`
              : ''
          }` +
          `${filters.paymentMethod.length > 0 && filters.filterOn ? `&paymentMethods=${filters.paymentMethod.join(',')}` : ''}` +
          `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`,
      )
      .then((response) => {
        const { data } = response;
        setRefunds(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleManuallRefund = async () => {
    setLoading(true);
    setLoadingMessage('Refunding orders manually');
    try {
      // Convert the array into a string with comma-separated values
      const barcodeNumbersString = selectedForRefund.join(',');

      // Encode the barcode numbers string
      // const encodedBarcode_numbers = encodeURIComponent(barcodeNumbersString);

      const response = await axios.post(
        `/dashboard/change-status-to-refound?barcode_numbers[]=${barcodeNumbersString}`,
      );

      // const response = await axios.post('/dashboard/refund-requested-orders  ', {
      //   barcode_numbers: selectedForRefund,
      // });

      setSelectedForRefund([]);
      if (response.data.status_code === 200) {
        setSnackBar(true);
        setRefundMessage(response.data.message);
        showToast(response.data.message, 'success');
        setSnackbarSeverity('success');
        fetchRefunds();
        setTimeout(() => {
          setSnackBar(false);
          setRefundMessage('');
          setSnackbarSeverity('');
        }, 3000);
        setLoading(false);
        setLoadingMessage('');
      }
      if (response.data.status_code == 500) {
        setLoading(false);
        setLoadingMessage('');
        const errorMessages = response.data.errors.map((error) => error.errors.base[0]);

        setRefundMessage(errorMessages);
        setSnackBar(true);
        setSnackbarSeverity('error');
        setTimeout(() => {
          setSnackBar(false);
          setRefundMessage('');
          setSnackbarSeverity('');
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      setLoadingMessage('');
      setRefundMessage(error.response.data.message);
      setSnackBar(true);
      setSnackbarSeverity('error');
      setTimeout(() => {
        setSnackBar(false);
        setRefundMessage('');
        setSnackbarSeverity('');
      }, 3000);
    }
  };

  const handleBulkRefund = async () => {
    setLoading(true);
    setLoadingMessage('Refunding orders');
    try {
      const response = await axios.post('/dashboard/refund-requested-orders  ', {
        barcode_numbers: selectedForRefund,
      });

      setSelectedForRefund([]);
      if (response.data.status_code === 200) {
        setSnackBar(true);
        setRefundMessage(response.data.message);
        setSnackbarSeverity('success');
        fetchRefunds();
        setTimeout(() => {
          setSnackBar(false);
          setRefundMessage('');
          setSnackbarSeverity('');
        }, 3000);
        setLoading(false);
        setLoadingMessage('');
      }
      if (response.data.status_code == 500) {
        setLoading(false);
        setLoadingMessage('');
        const errorMessages = response.data.errors.map((error) => error.errors.base[0]);

        setRefundMessage(errorMessages);
        setSnackBar(true);
        setSnackbarSeverity('error');
        setTimeout(() => {
          setSnackBar(false);
          setRefundMessage('');
          setSnackbarSeverity('');
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      setLoadingMessage('');
      setRefundMessage(error.response.data.message);
      setSnackBar(true);
      setSnackbarSeverity('error');
      setTimeout(() => {
        setSnackBar(false);
        setRefundMessage('');
        setSnackbarSeverity('');
      }, 3000);
    }
  };
  const clearFilters = () => {
    // Reset all filters
    setPage(1);
    setPageSize(10);
    setStartDate(new Date());
    setEndDate(new Date());
    setSearchText('');

    // Clear query parameters
    navigate(``);
  };

  useEffect(() => {
    fetchRefunds();
  }, [page, pageSize, startDate, endDate, searchTags, filters]);
  return (
    <div className="returns-container min-w-[1500px]">
      <div className="mb-4 flex flex-col  border bg-white p-4">
        <div className="  flex justify-between ">
          <div className="flex gap-3">
            <FilterSearchBar
              placeholder="Suchbegriff"
              searchText={searchText || ''}
              updateSearchText={updateSearchTextQueryParam}
              searchClick={fetchRefunds}
            />
            <ToggleFiltersButton filterOn={filters.filterOn} updateFilters={updateFilters} />
          </div>
          <div className="flex gap-4">
            <div
              onClick={selectedForRefund.length === 0 || loading ? null : handleManuallRefund}
              className={` btn ${
                selectedForRefund.length === 0 || loading
                  ? 'btn-secondary disabled '
                  : 'btn-primary'
              }`}
            >
              manuell erstattet
            </div>

            <div
              onClick={selectedForRefund.length === 0 || loading ? null : handleBulkRefund}
              className={` btn ${
                selectedForRefund.length === 0 || loading
                  ? 'btn-secondary disabled '
                  : 'btn-primary'
              }`}
            >
              Rückgabe erstatten
            </div>
          </div>
        </div>

        <Collapse in={filters.filterOn} timeout="auto" unmountOnExit>
          <div className="mt-5 flex flex-col gap-5">
            <div className=" flex">
              <div className="date-filter mr-2">
                <CustomDatePicker
                  startDate={startDate}
                  setStartDate={updateStartDateQueryParam}
                  endDate={endDate}
                  setEndDate={updateEndDateQueryParam}
                  filters={filters}
                  updateFilters={updateFilters}
                />
              </div>
              <div
                className="btn flex cursor-pointer items-center border-2 px-3 py-1"
                onClick={clearFilters}
              >
                Filter löschen
              </div>
            </div>

            <PaymentMethodFilter filters={filters} updateFilters={updateFilters} />
          </div>
          <div className="mt-5 flex  items-start justify-start">
            <input
              type="text"
              placeholder="Tags"
              className="tag-input"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
            <div className="flex flex-wrap gap-3 ps-5">
              {tags.map((tag, index) => (
                <div key={index}>
                  <Chip key={index} label={tag} onDelete={() => handleTagDelete(tag)} />
                </div>
              ))}
            </div>
          </div>
        </Collapse>
      </div>
      <div className="mt-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <p>{loadingMessage}</p>
            <Box>
              <PammysLoading />
            </Box>
          </div>
        ) : (
          <CustomReturnsTable
            columns={refundColumns}
            rows={refunds?.approved_orders?.data || []}
            page={page}
            pageSize={pageSize}
            total={refunds?.approved_orders?.total || 0}
            setPage={updatePageQueryParam}
            setPageSize={updatePageSizeQueryParam}
            handleCheck={handleCheckboxChange}
            selectedForRefund={selectedForRefund}
            handleCheckAll={handleSelectAll}
            filters={filters}
            updateFilters={updateFilters}
          />
        )}
      </div>

      {snackBar && (
        <CustomSnackBar
          message={refundMessage}
          severity={snackBarSeverity}
          duration={4000} // Adjust the duration as needed
          open={snackBar}
          handleClose={() => setSnackBar(false)}
        />
      )}
    </div>
  );
};

export default DashboardRefundPage;
