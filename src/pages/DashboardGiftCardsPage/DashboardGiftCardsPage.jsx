import { useEffect, useState } from 'react';
import queryString from 'query-string';
import { CustomBreadCrumb } from '../../components/atoms';
import { GiftCardTabContent } from '../../components/molecules';
import { Layout } from '../../components/template';
import { useLocation, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../components/useDocumentTitle';
import axios from '../../utils/axios';
import { FilterSearchBar } from '../../components/atoms';
import { CustomDatePicker } from '../../components/molecules';
import { CustomReturnsTable } from '../../components/molecules/CustomReturnsTable/CustomReturnsTable';
import dayjs from 'dayjs';
import { Collapse } from '@mui/material';
import { PaymentMethodFilter } from '../../components/molecules/PaymentMethodFilter/PaymentMethodFilter';
import { ToggleFiltersButton } from '../../components/atoms/Buttons/ToggleFiltersButton';

const DashboardGiftsCardPage = () => {
  useDocumentTitle('Pammys | Dashboard - Gift cards');
  const location = useLocation();
  const navigate = useNavigate();
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const parsed = queryString.parse(location.search);
  const activeTabQueryParam = parsed.activeTab;
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
        console.log('Updated filter: ', key, value);
        updatedContext[key] = value;
      }
      return updatedContext;
    });
  };

  const validTabValues = ['approved', 'partially'];
  const [activeTab, setActiveTab] = useState(
    validTabValues.includes(activeTabQueryParam) ? activeTabQueryParam : 'approved',
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
    const updatedSearch = `activeTab=${activeTabValue}&page=${page}&per_page=${pageSize}`;
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
    setActiveTab('approved');
    setPage(1);
    setPageSize(10);
    setStartDate(defaultStartDate);
    setEndDate(new Date());
    setSearchText('');

    // Clear query parameters
    navigate(``);
  };
  const fetchGiftCards = async () => {
    setLoading(true);
    const res = await axios
      .get(
        `/all-orders?` +
          `&gift_card_offer=true` +
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
          `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`,
        // `&start_date=${dayjs(startDate).format('YYYY-MM-DD')}` +
        // `&end_date=${dayjs(endDate).format('YYYY-MM-DD')}`,
      )
      .then((response) => {
        const { data } = response;
        console.log(data);
        setGiftCards(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchGiftCards();
  }, [page, pageSize, activeTab, startDate, endDate, filters]);

  useEffect(() => {
    if (parsed.activeTab) {
      setActiveTab(parsed.activeTab);
    }
  }, [parsed.activeTab]);
  return (
    <div className="returns-container">
      <div className="mb-4 flex flex-col  border bg-white p-4">
        <div className="  flex items-center gap-3 ">
          <FilterSearchBar
            searchText={searchText}
            placeholder="Suchbegriff"
            updateSearchText={updateSearchTextQueryParam}
            searchClick={fetchGiftCards}
          />
          <ToggleFiltersButton filterOn={filters.filterOn} updateFilters={updateFilters} />
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
        </Collapse>
      </div>

      <div>
        <GiftCardTabContent
          page={page}
          activeTab={activeTab}
          pageSize={pageSize}
          setPage={updatePageQueryParam}
          setPageSize={updatePageSizeQueryParam}
          setActiveTab={updateActiveTabQueryParam}
          orders={giftCards || []}
          loading={loading}
          filters={filters}
          updateFilters={updateFilters}
        />
      </div>
    </div>
  );
};

export default DashboardGiftsCardPage;
