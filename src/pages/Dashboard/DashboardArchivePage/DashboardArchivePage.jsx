import axios from '../../../utils/axios';
import queryString from 'query-string';
import useDocumentTitle from '../../../components/useDocumentTitle';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { Layout } from '../../../components/template';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomDatePicker } from '../../../components/molecules';
import { FilterSearchBar } from '../../../components/atoms';
import { Collapse } from '@mui/material';
import { PaymentMethodFilter } from '../../../components/molecules/PaymentMethodFilter/PaymentMethodFilter';
import { CustomReturnsTable } from '../../../components/molecules/CustomReturnsTable/CustomReturnsTable';
import { archiveTable } from '../../../data/tables/archiveTable';

const DashboardArchivePage = () => {
  useDocumentTitle('Pammys | Archiv');
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Extract query parameters from the URL
  const parsed = queryString.parse(location.search);
  // Initialize state variables with query parameter values, or default values
  const activeTabQueryParam = parsed.activeTab;
  const activeSubTabQueryParam = parsed.activeSubTab;

  const pageQueryParam = parseInt(parsed.page, 10);
  const pageSizeQueryParam = parseInt(parsed.pageSize, 10);
  const startDateQueryParam = parsed.startDate;
  const endDateQueryParam = parsed.endDate;
  const defaultStartDate = dayjs().subtract(1, 'month').toDate();

  const [filters, setFilters] = useState({
    filterOn: false,
    filterDate: false,
    sortBy: 'asc',
    sortWith: '',
    paymentMethod: [],
  });

  const updateFilters = useCallback(
    (fieldsToUpdate) => {
      setFilters((prevContext) => {
        let updatedContext = { ...prevContext };
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
          console.log('Updated filter: ', key, value);
          updatedContext[key] = value;
        }
        return updatedContext;
      });
    },
    [setFilters],
  );
  const validTabValues = [
    'all',
    'requested',
    'in progress',
    'approved',
    'refunded',
    'rejected',
    'exchanged',
    'canceled',
    'partially',
  ];
  const validSubTabValue = [
    'all',
    'customer_contacted',
    'sent_back_to_customer',
    'donated',
    'returned',
  ];
  const [activeTab, setActiveTab] = useState(
    validTabValues.includes(activeTabQueryParam) ? activeTabQueryParam : 'all',
  );
  const [activeSubTab, setActiveSubTab] = useState(
    validSubTabValue.includes(activeSubTabQueryParam) ? activeSubTabQueryParam : 'all',
  );
  const [page, setPage] = useState(!isNaN(pageQueryParam) ? pageQueryParam : 1); // Default to page 1
  const [pageSize, setPageSize] = useState(!isNaN(pageSizeQueryParam) ? pageSizeQueryParam : 10); // Default to page size 10
  const [searchText, setSearchText] = useState(parsed.searchText || '');
  const [startDate, setStartDate] = useState(
    startDateQueryParam ? dayjs(startDateQueryParam).toDate() : defaultStartDate, // Use current date if startDateQueryParam is not present
  );
  const [endDate, setEndDate] = useState(
    endDateQueryParam ? dayjs(endDateQueryParam).toDate() : new Date(), // Use current date if endDateQueryParam is not present
  );
  const updateSearchTextQueryParam = (newSearchText) => {
    if (newSearchText.length > 1) {
      if (newSearchText[0] == '#') {
        newSearchText = newSearchText.substring(1); // Remove the first character
      }
    }
    setSearchText(newSearchText);
    const updatedSearch = `activeTab=${activeTab}&page=${page}&pageSize=${pageSize}&searchText=${encodeURIComponent(
      newSearchText,
    )}`;

    navigate(`?${updatedSearch}`);
  };
  const updateStartDateQueryParam = (newStartDate) => {
    setStartDate(newStartDate);
    const formattedStartDate = dayjs(newStartDate).format('YYYY-MM-DD');
    const updatedSearch = `activeTab=${activeTab}&page=${page}&pageSize=${pageSize}&startDate=${formattedStartDate}&endDate=${
      endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''
    }`;
    navigate(`?${updatedSearch}`);
  };

  const updateEndDateQueryParam = (newEndDate) => {
    setEndDate(newEndDate);
    const formattedEndDate = dayjs(newEndDate).format('YYYY-MM-DD');
    const updatedSearch = `activeTab=${activeTab}&page=${page}&pageSize=${pageSize}&startDate=${
      startDate ? dayjs(startDate).format('YYYY-MM-DD') : ''
    }&endDate=${formattedEndDate}`;
    navigate(`?${updatedSearch}`);
  };
  const updateActiveTabQueryParam = (activeTabValue) => {
    // #rgnpcrz-note
    // this stateChange doesnt do anything crucial
    // url param is used for state managment
    // setActiveTab(activeTabValue);
    const updatedSearch = `activeTab=${activeTabValue}&page=${page}&per_page=${pageSize}`;
    navigate(`?${updatedSearch}`);
  };
  const updateActiveSubTabQueryParam = (activeSubTabValue) => {
    setActiveSubTab(activeSubTabValue);
    const updatedSearch = `activeTab=${activeTab}&page=${page}&per_page=${pageSize}&activeSubTab=${activeSubTabValue}`;
    navigate(`?${updatedSearch}`);
  };

  // Function to update the page query parameter and state
  const updatePageQueryParam = (newPage) => {
    setPage(newPage);
    const updatedSearch = `activeTab=${activeTab}&page=${newPage}&per_page=${pageSize}`;
    navigate(`?${updatedSearch}`);
  };

  // Function to update the pageSize query parameter and state
  const updatePageSizeQueryParam = (newPageSize) => {
    setPageSize(newPageSize);
    const updatedSearch = `activeTab=${activeTab}&page=${page}&pageSize=${newPageSize}`;
    navigate(`?${updatedSearch}`);
  };

  const clearFilters = () => {
    // Reset all filters
    setActiveTab('all');
    setPage(1);
    setPageSize(10);
    setStartDate(defaultStartDate);
    setEndDate(new Date());

    // Clear query parameters
    navigate(``);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/dashboard/deleted-requested-orders?` +
          `&page=${page}` +
          `&pagination=${pageSize}` +
          `${
            filters.filterDate
              ? `${startDate !== '' ? `&start_date=${dayjs(startDate).format('YYYY-MM-DD')}` : ''}` +
                `${endDate !== '' ? `&end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : ''}`
              : ''
          }` +
          `${searchText.length > 0 ? `&search=${searchText}` : ''}` +
          `${filters.paymentMethod.length > 0 && filters.filterOn ? `&paymentMethods=${filters.paymentMethod.join(',')}` : ''}` +
          `${activeSubTab !== 'all' ? `&rejected_customer_notification=${activeSubTab}` : ''}` +
          `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`,
      );

      const { data } = res;
      console.log(data);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, pageSize, activeTab, startDate, endDate, activeSubTab, filters]);

  // Update the activeTab state when parsed.activeTab changes
  useEffect(() => {
    // updatePageQueryParam(page);
    // updatePageSizeQueryParam(pageSize);
    if (!parsed.activeTab) {
      updateActiveTabQueryParam(activeTab);
    }
    if (parsed.activeTab) {
      setActiveTab(parsed.activeTab);
    }
  }, [parsed.activeTab]);

  return (
    <div className="returns-container">
      <div className="mb-4 flex flex-col  border bg-white p-4">
        <div className="  flex items-center ">
          <FilterSearchBar
            placeholder="Suchbegriff"
            searchText={searchText}
            updateSearchText={updateSearchTextQueryParam}
            searchClick={fetchOrders}
          />

          {/* Filter is disbled on this page */}
          {/* <div
            className={
              'flex cursor-pointer items-center px-3 py-1 ' +
              (filters.filterOn ? 'bg-accent' : 'bg-secondary')
            }
            onClick={() => {
              updateFilters({ filterOn: !filters.filterOn });
            }}
          >
            {filters.filterOn ? 'Filter ausblenden' : 'Filter einblenden'}
          </div> */}
        </div>
        {/* Filter is disbled on this page */}
        {/* <Collapse in={filters.filterOn} timeout="auto" unmountOnExit>
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
                className="flex cursor-pointer items-center border-2 px-3 py-1 btn"
                onClick={clearFilters}
              >
                Filter löschen
              </div>
            </div>

            <PaymentMethodFilter filters={filters} updateFilters={updateFilters} />
          </div>
        </Collapse> */}
      </div>

      <CustomReturnsTable
        columns={archiveTable}
        rows={orders.deleted_requested_orders || []}
        page={page}
        pageSize={pageSize}
        total={orders.total || 0}
        setPage={setPage}
        setPageSize={setPageSize}
        loading={loading}
        filters={filters}
        updateFilters={updateFilters}
      />
    </div>
  );
};

export default DashboardArchivePage;
