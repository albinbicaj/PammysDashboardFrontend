import { Tab, TableCell, Tabs, tableCellClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { PickListColumns } from '../../../context/PickListColumns';
import { TabPanel } from '../../atoms';
import { OverivewTab } from '../OverivewTab/OverivewTab';
import { PickListTableRule } from '../PickListTableRule/PickListTableRule';
import showToast from '../../../hooks/useToast';

export const PickListTabContent = ({
  setFetchedPickedList,
  fetchedPickedList,
  fetchPickList,
  setCurrentTab,
  currentTab,
  handleSearchChange,
  searchTerm,
  setFilters,
  filters,
  loadingTable,
  setLoadingTable,
}) => {
  const [columnFilters, setColumnFilters] = useState({});
  const [openRows, setOpenRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [saveFullQuery, setSaveFullQuery] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const handleFilterChange = (column, value) => {
    setColumnFilters((prevFilters) => ({
      ...prevFilters,
      [column.field]: value,
    }));
  };

  const toggleRow = (rowId) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(rowId)
        ? prevOpenRows.filter((id) => id !== rowId)
        : [...prevOpenRows, rowId],
    );
  };

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('tab', newValue);
    navigate({ search: queryParams.toString() });
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f3f4f6',
      color: theme.palette.common.black,
      paddingTop: '0',
      paddingBottom: '0',
      textAlign: 'left',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const fetchData = async (newPage, newRowsPerPage) => {
    try {
      let filtersQuery = `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;
      const query = `?page=${newPage + 1}&paginate=${newRowsPerPage}` + filtersQuery;

      const filterParams = new URLSearchParams(columnFilters).toString();
      const fullQuery = query + (filterParams ? `&${filterParams}` : '');
      setSaveFullQuery(fullQuery);

      const data = await fetchPickList(fullQuery);
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChangePage = async (event, newPage) => {
    if (newPage < 0 || newPage >= fetchedPickedList?.rules?.last_page) {
      return;
    }
    await fetchData(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    await fetchData(0, newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
  };

  const handleEditPickList = (row) => {
    setCurrentTab('overview');
    const { pathname } = location;
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('id', row.id);
    searchParams.set('tab', 'overview'); // Set tab to 'overview'
    const newUrl = `${pathname}?${searchParams.toString()}`;
    navigate(newUrl, { replace: true });
  };

  const handleDeletePickList = async (row) => {
    setLoadingTable(true);
    try {
      await axiosInstance.delete(`/`).then((res) => {
        fetchPickList(saveFullQuery);
        setLoadingTable(false);
        showToast('Erfolgreich', 'success');
      });
    } catch (error) {
      console.error('Error deleting pick list:', error);
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    if (currentTab === 'definition') {
      const { pathname, search } = location;
      const newSearch = new URLSearchParams(search);
      newSearch.delete('id');
      navigate(`${pathname}?${newSearch.toString()}`);
    }
  }, [location.search, currentTab]);

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [columnFilters, page, rowsPerPage, filters, currentTab]);

  return (
    <div>
      <div className="border-[rgba(224, 224, 224, 1)] mt-4 flex items-center justify-between border bg-white p-4">
        <div className="input flex w-[340px] items-center pl-3">
          <div className="search-icon-wrapper">
            <IoSearch />
          </div>
          <input
            type="text"
            placeholder="Suche"
            value={searchTerm}
            onChange={handleSearchChange}
            className="orders-search-input border-none outline-none"
          />
        </div>
      </div>
      <Tabs
        className="relative z-0 mb-4 mt-4 flex w-full items-center border-b border-t bg-white"
        value={currentTab}
        onChange={handleChange}
        sx={{
          '& .MuiTabs-indicator': { backgroundColor: '#4b5563', zIndex: 1 },
          '& .Mui-selected': { color: '#4b5563 !important;', zIndex: 1 },
        }}
      >
        <Tab
          label="Definition"
          value={'definition'}
          sx={{
            textTransform: 'none',
          }}
        />
        <Tab
          label="Übersicht"
          value={'overview'}
          sx={{
            textTransform: 'none',
          }}
        />
      </Tabs>
      <TabPanel value={currentTab} index={'definition'}>
        <PickListTableRule
          PickListColumns={PickListColumns}
          handleFilterChange={handleFilterChange}
          toggleRow={toggleRow}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          StyledTableCell={StyledTableCell}
          columnFilters={columnFilters}
          fetchedPickedList={fetchedPickedList}
          openRows={openRows}
          rowsPerPage={rowsPerPage}
          page={page}
          setPage={setPage}
          handleChangePage={handleChangePage}
          handleEditPickList={handleEditPickList}
          handleDeletePickList={handleDeletePickList}
          filters={filters}
          setFilters={setFilters}
          setColumnFilters={setColumnFilters}
          loadingTable={loadingTable}
          fetchData={fetchData}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={'overview'}>
        <OverivewTab
          fetchPickList={fetchPickList}
          setPage={setPage}
          setCurrentTab={setCurrentTab}
          currentTab={currentTab}
        />
      </TabPanel>
    </div>
  );
};
