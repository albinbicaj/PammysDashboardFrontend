import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { CustomDatePicker } from '../../components/molecules';
import dayjs from 'dayjs';
import axios from '../../utils/axios';
import { FilterSearchBar } from '../../components/atoms';
import { TabContentDamaged } from '../../components/molecules/TabContentDamaged/TabContentDamaged';
import { damagedTable } from '../../data/tables/damagedTable';
import { Collapse } from '@mui/material';
import { PaymentMethodFilter } from '../../components/molecules/PaymentMethodFilter/PaymentMethodFilter';
import { ToggleFiltersButton } from '../../components/atoms/Buttons/ToggleFiltersButton';
import DownloadCSVButton from '../../components/atoms/DownloadCSVButton/DownloadCSVButton';

const DashboardDamagedPage = () => {
  const [damagedItems, setDamagedItems] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const parsed = queryString.parse(location.search);
  const [loading, setLoading] = useState(true);

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

  const updateFilters = (fieldsToUpdate) => {
    setFilters((prevContext) => {
      let updatedContext = { ...prevContext };
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        updatedContext[key] = value;
      }
      return updatedContext;
    });
  };

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
  const [activeTab, setActiveTab] = useState(
    validTabValues.includes(activeTabQueryParam) ? activeTabQueryParam : 'all',
  );
  const [activeSubTab, setActiveSubTab] = useState(
    validTabValues.includes(activeSubTabQueryParam) ? activeSubTabQueryParam : '5',
  );
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
    const updatedSearch = `activeTab=${activeTab}&page=${page}&pageSize=${pageSize}&startDate=${formattedStartDate}&endDate=${
      endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''
    }`;
    navigate(`?${updatedSearch}`);
  };
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
  const updateEndDateQueryParam = (newEndDate) => {
    setEndDate(newEndDate);
    const formattedEndDate = dayjs(newEndDate).format('YYYY-MM-DD');
    const updatedSearch = `activeTab=${activeTab}&page=${page}&pageSize=${pageSize}&startDate=${
      startDate ? dayjs(startDate).format('YYYY-MM-DD') : ''
    }&endDate=${formattedEndDate}`;
    navigate(`?${updatedSearch}`);
  };
  const updateActiveTabQueryParam = (activeTabValue) => {
    if (activeTabValue === 'requested' || activeTabValue === 'rejected_support') {
      updateActiveSubTabQueryParam('5');
    } else if (activeTabValue === 'rejected_lager') {
      updateActiveSubTabQueryParam('all');
    }
    setActiveTab(activeTabValue);
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
    const updatedSearch = `activeTab=${activeTab}&page=${newPage}&pageSize=${pageSize}`;
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
    setStartDate(new Date());
    setEndDate(new Date());
    setSearchText('');

    // Clear query parameters
    navigate(``);
  };

  const queryURL =
    `${
      activeTab === 'support'
        ? `&status=all&support_status=true&reason=5`
        : activeTab === 'rejected_support'
          ? `&status=rejected&support_status=requested&reason=${activeSubTab}`
          : activeTab === 'rejected_lager'
            ? activeSubTab === 'all'
              ? `&status=rejected&support_status=rejected&reason=5,7&rejected_customer_notification=`
              : `&status=rejected&support_status=rejected&reason=5,7&rejected_customer_notification=${activeSubTab}`
            : activeTab === 'all'
              ? `&status=all&reason=5,7`
              : activeTab === 'requested'
                ? activeSubTab === 'package_damaged'
                  ? '&status=requested&reason=5,7&package_damaged=true'
                  : activeSubTab === '5'
                    ? '&status=requested&reason=5'
                    : activeSubTab === '7'
                      ? '&status=requested&reason=7'
                      : ''
                : activeTab === 'approved'
                  ? '&status=approved&reason=5'
                  : activeTab === 'partially'
                    ? '&status=partially&reason=5'
                    : activeTab === 'refunded'
                      ? '&status=refunded&reason=5'
                      : ''
    }` +
    `${searchText.length > 0 ? `&search=${searchText}` : ''}` +
    `${filters.paymentMethod.length > 0 && filters.filterOn ? `&paymentMethods=${filters.paymentMethod.join(',')}` : ''}` +
    `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;

  const queryWithFiltersUrl =
    `?page=${page}` +
    `&pagination=${pageSize}` +
    `${
      filters.filterDate
        ? `${startDate !== '' ? `&start_date=${dayjs(startDate).format('YYYY-MM-DD')}` : ''}` +
          `${endDate !== '' ? `&end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : ''}`
        : ''
    }` +
    queryURL;

  const fetchOrders = () => {
    setLoading(true);
    axios
      .get(`/all-orders` + queryWithFiltersUrl)
      .then((response) => {
        const { data } = response;
        setLoading(false);

        setDamagedItems(data);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [page, pageSize, activeTab, startDate, endDate, activeSubTab, filters]);

  // Update the activeTab state when parsed.activeTab changes
  useEffect(() => {
    if (!parsed.activeTab) {
      updateActiveTabQueryParam(activeTab);
    }
    if (parsed.activeTab) {
      setActiveTab(parsed.activeTab);
    }
  }, [parsed.activeTab]);

  return (
    <div className="returns-container">
      <div className=" mb-4 flex flex-col border bg-white p-4">
        <div className="  flex items-center gap-3">
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
                  disabled={damagedItems?.requested_orders?.total === 0}
                />
              </div>
            </div>
          </div>
        </Collapse>
      </div>
      <div className="">
        <TabContentDamaged
          page={page}
          setPage={updatePageQueryParam} // Pass the update function
          pageSize={pageSize}
          setPageSize={updatePageSizeQueryParam} // Pass the update function
          orders={damagedItems}
          activeTab={activeTab}
          setActiveTab={updateActiveTabQueryParam}
          activeSubTab={activeSubTab}
          setActiveSubTab={updateActiveSubTabQueryParam}
          columns={damagedTable}
          loading={loading}
          filters={filters}
          updateFilters={updateFilters}
        />
      </div>
    </div>
  );
};
export default DashboardDamagedPage;
