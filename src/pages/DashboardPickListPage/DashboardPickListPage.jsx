import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Layout } from '../../components/template';
import { useLocation, useNavigate } from 'react-router-dom';
import { PickListTabContent } from '../../components/molecules';
import { Typography } from '@mui/material';
const DashboardPickListPage = () => {
  const [fetchedPickedList, setFetchedPickedList] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('definition');
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingTable, setLoadingTable] = useState(true);
  const [filters, setFilters] = useState({
    filterDate: false,
    sortBy: 'asc',
    sortWith: '',
    paymentMethod: [],
  });

  const handleNewButtonClick = () => {
    setCurrentTab('overview');
    const { pathname, search } = location;
    const newSearch = new URLSearchParams(search);
    newSearch.delete('id');
    newSearch.set('tab', 'overview');
    navigate(`${pathname}?${newSearch.toString()}`);
  };

  const fetchPickList = async (query = '?page=1&paginate=10') => {
    setLoadingTable(true);
    let filtersQuery = `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;
    try {
      await axiosInstance.get(`/picklist/rules${query}${filtersQuery}`).then((res) => {
        setLoadingTable(false);
        const data = res.data;
        setFetchedPickedList(data);
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoadingTable(false);
    }
  };

  const handleSearchChange = async (event) => {
    setLoadingTable(true);
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm.trim() === '') {
      fetchPickList();
      return;
    }

    try {
      const response = await axiosInstance.get('/picklist/search', {
        params: {
          search: newSearchTerm,
        },
      });

      const responseData = response.data;
      setFetchedPickedList({ rules: { data: responseData.data } });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchPickList();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');
    if (tab) {
      setCurrentTab(tab);
    } else {
      setCurrentTab('definition');
    }
  }, [location.search]);

  return (
    <div className="xentral-container">
      <div className="flex items-center justify-end">
        <div className="btn">
          <button
            onClick={handleNewButtonClick}
            className="btn btn-primary flex items-center gap-1"
          >
            <Typography variant="span" component="span">
              +<span>Neu</span>
            </Typography>
          </button>
        </div>
      </div>

      <PickListTabContent
        setFetchedPickedList={setFetchedPickedList}
        fetchedPickedList={fetchedPickedList}
        fetchPickList={fetchPickList}
        setCurrentTab={setCurrentTab}
        currentTab={currentTab}
        handleSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        setFilters={setFilters}
        filters={filters}
        loadingTable={loadingTable}
        setLoadingTable={setLoadingTable}
      />
    </div>
  );
};
export default DashboardPickListPage;
