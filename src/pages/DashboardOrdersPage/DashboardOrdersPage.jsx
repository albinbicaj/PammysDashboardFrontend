import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../components/useDocumentTitle';
import axios from '../../utils/axios';
import { OrdersTabContent } from '../../components/molecules';
import axiosInstance from '../../utils/axios';
import showToast from '../../hooks/useToast';

const DashboardOrdersPage = () => {
  useDocumentTitle('Pammys | Dashboard Orders');
  const location = useLocation();
  const navigate = useNavigate();
  const [saveQueryTable, setSaveQueryTable] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingFullTable, setLoadingFullTable] = useState(true);
  const [saveTableParam, setSaveTableParam] = useState('');
  const [fetchedOrders, setFetchedOrders] = useState([]);
  const [monitor, setMonitor] = useState(false);
  const [filters, setFilters] = useState({
    filterDate: false,
    sortBy: 'asc',
    sortWith: '',
    paymentMethod: [],
  });

  const updateStartDateQueryParam = (newStartDate) => {
    setStartDate(newStartDate);
  };

  const updateEndDateQueryParam = (newEndDate) => {
    setEndDate(newEndDate);
  };

  const fetchOrdersFromStore = async () => {
    setLoadingFullTable(true);
    setLoading(true);
    setLoadingTable(true);
    const cleanedQuery = removePageAndPaginate(saveQueryTable);
    try {
      axios
        .get(`/order/store-orders`)
        .then((response) => {
          setLoading(false);
          showToast('Erfolgreich abgeholte Aufträge', 'success');
        })
        .catch((error) => {
          console.error(error);
          showToast('Etwas ist schief gelaufen', 'failure');
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      showToast('Etwas ist schief gelaufen', 'failure');
      setLoading(false);
      setLoadingTable(false);
      setLoadingFullTable(false);
    } finally {
      setLoadingTable(false);
      await fetchOrders(
        true,
        `monitor=${monitor}&${cleanedQuery}&page=${page}&paginate=${rowsPerPage}`,
      );
    }
  };

  const fetchOrders = async (includeQuery, queryTable = '') => {
    setLoadingTable(true);
    // setLoadingFullTable(false);
    let query = `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;
    const fullQuery = query + (queryTable ? `&${queryTable}` : '');
    try {
      const res = await axiosInstance
        .get(`/order/get-orders?${fullQuery}`)
        .then((response) => {
          setFetchedOrders(response?.data);
          setLoadingTable(false);
        })
        .catch((error) => {
          console.error(error);
          setLoadingTable(false);
        });
    } catch (error) {
      console.error(error);
      setLoadingTable(false);
    }
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    const newLocation = { ...location, search: '' };
    navigate(newLocation, { replace: true });
  };

  const removePageAndPaginate = (query) => {
    if (query) {
      return query.replace(/&?monitor=\d+/, '');
    }
  };

  const onCheckboxChange = (e) => {
    setMonitor((prev) => !prev);
    const cleanedQuery = removePageAndPaginate(saveQueryTable);
    fetchOrders(
      true,
      `monitor=${e.target.checked}&${cleanedQuery}&page=${page + 1}&paginate=${rowsPerPage}&${saveTableParam}`,
    );
  };

  useEffect(() => {
    fetchOrders(
      true,
      `${saveQueryTable}&page=${page + 1}&paginate=${rowsPerPage}&monitor=${monitor}&${saveTableParam}`,
    );
  }, [filters.sortBy, filters.sortWith]);

  return (
    <div className={loadingFullTable ? 'xentral-container relative' : 'xentral-container'}>
      <OrdersTabContent
        fetchOrders={fetchOrders}
        fetchOrdersFromStore={fetchOrdersFromStore}
        page={page}
        setPage={setPage}
        orders={fetchedOrders}
        startDate={startDate}
        setStartDate={updateStartDateQueryParam}
        endDate={endDate}
        setEndDate={updateEndDateQueryParam}
        loadingFullTable={loadingFullTable}
        onCheckboxChange={onCheckboxChange}
        setFetchedOrders={setFetchedOrders}
        loading={loading}
        resetFilters={resetFilters}
        filters={filters}
        setFilters={setFilters}
        loadingTable={loadingTable}
        setRowsPerPage={setRowsPerPage}
        rowsPerPage={rowsPerPage}
        setSaveQueryTable={setSaveQueryTable}
        saveQueryTable={saveQueryTable}
        monitor={monitor}
        setSaveTableParam={setSaveTableParam}
        saveTableParam={saveTableParam}
      />
    </div>
  );
};
export default DashboardOrdersPage;
