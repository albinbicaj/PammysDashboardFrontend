import { useCallback, useEffect, useState } from 'react';
import { TabContent } from '../../components/molecules';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import axios from '../../utils/axios';
import useDocumentTitle from '../../components/useDocumentTitle';
import { CustomDatePicker } from '../../components/molecules';
import dayjs from 'dayjs';
import { FilterSearchBar } from '../../components/atoms';
import { returnTable } from '../../data/tables/returnTable';
import { Collapse } from '@mui/material';
import { PaymentMethodFilter } from '../../components/molecules/PaymentMethodFilter/PaymentMethodFilter';
import { ToggleFiltersButton } from '../../components/atoms/Buttons/ToggleFiltersButton';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../utils/axios';
import DownloadCSVButton from '../../components/atoms/DownloadCSVButton/DownloadCSVButton';
import { returnsFilter } from '../../data/returnsFilter';

const DashboardReturnPage = () => {
  useDocumentTitle('Pammys | Dashboard');
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

  const [filters, setFilters] = useState(returnsFilter);

  // Function to apply the filters in the parent
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // const updateFilters = (fieldsToUpdate) => {
  //   setFilters((prevContext) => {
  //     let updatedContext = { ...prevContext };
  //     for (const [key, value] of Object.entries(fieldsToUpdate)) {
  //       console.log('Updated filter: ', key, value);
  //       updatedContext[key] = value;
  //     }
  //     return updatedContext;
  //   });
  // };

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

  const queryWithFiltersUrl =
    `?requested_type=return` +
    `&page=${page}` +
    `&pagination=${pageSize}` +
    `&status=${activeTab}` +
    `${
      filters.filterDate
        ? `${startDate !== '' ? `&start_date=${dayjs(startDate).format('YYYY-MM-DD')}` : ''}` +
          `${endDate !== '' ? `&end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : ''}`
        : ''
    }` +
    `${searchText.length > 0 ? `&search=${searchText}` : ''}` +
    `${filters.paymentMethod.length > 0 && filters.filterOn ? `&paymentMethods=${filters.paymentMethod.join(',')}` : ''}` +
    `${activeSubTab !== 'all' ? `&rejected_customer_notification=${activeSubTab}` : ''}` +
    `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;

  const fetchOrders = async () => {
    setLoading(true);
    const res = await axios
      .get(`/all-orders` + queryWithFiltersUrl)
      .then((response) => {
        const { data } = response;
        setOrders(data);
        setLoading(false);
      })

      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  // const responseQuery = useQuery({
  //   queryKey: ['dashboardReturns'],
  //   queryFn: axios.get(`/all-orders?`),
  // });

  const { isLoading, error, data } = useQuery({
    queryKey: [
      'dashboardReturns',
      page,
      pageSize,
      activeTab,
      startDate,
      endDate,
      activeSubTab,
      filters,
      searchText,
    ],
    queryFn: () => axiosInstance.get(`/all-orders` + queryWithFiltersUrl),
  });

  console.log('DATA FETCHED WITH react-query: ', isLoading);

  // useEffect(() => {
  //   fetchOrders();
  // }, [page, pageSize, activeTab, startDate, endDate, activeSubTab, filters]); // Update orders when page or pageSize changes

  // Update the activeTab state when parsed.activeTab changes
  useEffect(() => {
    // updatePageQueryParam(page);
    // updatePageSizeQueryParam(pageSize);
    if (!parsed.activeTab) {
      console.log('parsed.activeTab false');
      updateActiveTabQueryParam(activeTab);
    }
    if (parsed.activeTab) {
      console.log('parsed.activeTab true');
      setActiveTab(parsed.activeTab);
    }
  }, [parsed.activeTab]);

  // if (isLoading) {
  //   return <PammysLoading />;
  // }
  // return <pre>{JSON.stringify(data, null, 2)}</pre>;

  return (
    <div className="returns-container">
      <div className="mb-4 flex flex-col  border bg-white p-4">
        <div className="  flex items-center gap-3 ">
          <FilterSearchBar
            placeholder="Suchbegriff"
            searchText={searchText}
            updateSearchText={updateSearchTextQueryParam}
            searchClick={fetchOrders}
          />
          <ToggleFiltersButton filterOn={filters.filterOn} updateFilters={updateFilters} />
        </div>

        <Collapse in={filters.filterOn} timeout="auto" unmountOnExit>
          <div className="mt-5 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-5">
                <div className="flex items-center">
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
              <div>
                <DownloadCSVButton
                  text="Export CSV"
                  endpoint="/dashboard/requested-orders-csv"
                  query={queryWithFiltersUrl}
                  fileName="requested-orders"
                  disabled={data?.data?.requested_orders?.total === 0}
                />
              </div>
            </div>
          </div>
        </Collapse>
      </div>

      {/* <pre>{JSON.stringify(data?.data?.requested_orders?.data, null, 2)}</pre> */}
      <TabContent
        page={page}
        setPage={updatePageQueryParam} // Pass the update function
        pageSize={pageSize}
        setPageSize={updatePageSizeQueryParam} // Pass the update function
        orders={data?.data || []}
        activeTab={activeTab}
        setActiveTab={updateActiveTabQueryParam}
        activeSubTab={activeSubTab}
        setActiveSubTab={updateActiveSubTabQueryParam}
        columns={returnTable}
        loading={isLoading}
        filters={filters}
        updateFilters={updateFilters}
      />
    </div>
  );
};

export default DashboardReturnPage;
