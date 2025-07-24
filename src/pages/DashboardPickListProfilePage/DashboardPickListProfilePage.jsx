import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Layout } from '../../components/template';
import { useLocation, useNavigate } from 'react-router-dom';
import { PickListProfileTabContent } from '../../components/molecules/PickListProfileTabContent/PickListProfileTabContent';
import axiosInstance from '../../utils/axios';

const DashboardPickListProfilePage = () => {
  const [fetchedPickedListProfile, setFetchedPickedListProfile] = useState([]);
  const [currentTab, setCurrentTab] = useState('picklist');
  const [saveStatus, setSaveStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columnFilters, setColumnFilters] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingFullTable, setLoadingFullTable] = useState(true);

  const [filters, setFilters] = useState({
    filterDate: false,
    sortBy: 'asc',
    sortWith: '',
    paymentMethod: [],
  });

  const getPicklists = async (status = '', extraQuery) => {
    setLoadingTable(true);
    try {
      let filtersQuery = `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;
      const query = `?status=${status}`;
      const fullQuery = query + filtersQuery;
      await axiosInstance.get(`/picklist/get-picklists${fullQuery}${extraQuery}`).then((res) => {
        setLoadingTable(false);
        setFetchedPickedListProfile(res.data.list);
      });
    } catch (error) {
      console.log('error', error);
      setLoadingTable(false);
    }
  };

  const fetchData = async (status, newPage = page, newRowsPerPage = rowsPerPage) => {
    setSaveStatus(status);
    try {
      const query = `&page=${newPage + 1}&paginate=${newRowsPerPage}`;
      const filterParams = new URLSearchParams(columnFilters).toString();
      const fullQuery = query + (filterParams ? `&${filterParams}` : '');
      getPicklists(status, fullQuery);
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const tabStatusMapping = {
      picklist: undefined,
      downloaded: 1,
      finished: 2,
      working: 3,
    };

    const status = tabStatusMapping[currentTab];

    fetchData(status);
  }, [currentTab, filters, columnFilters]);

  return (
    <div className="xentral-container">
      <PickListProfileTabContent
        setCurrentTab={setCurrentTab}
        currentTab={currentTab}
        setFetchedPickedListProfile={setFetchedPickedListProfile}
        fetchedPickedListProfile={fetchedPickedListProfile}
        getPicklists={getPicklists}
        setFilters={setFilters}
        filters={filters}
        fetchData={fetchData}
        saveStatus={saveStatus}
        page={page}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        rowsPerPage={rowsPerPage}
        setColumnFilters={setColumnFilters}
        columnFilters={columnFilters}
        loadingTable={loadingTable}
        setLoadingTable={setLoadingTable}
        setLoadingFullTable={setLoadingFullTable}
        loadingFullTable={loadingFullTable}
      />
    </div>
  );
};
export default DashboardPickListProfilePage;
