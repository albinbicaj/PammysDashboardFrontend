import {
  Alert,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { EditOrderIcon } from '../../components/atoms';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
import { DispatchCenter } from '../../context/DispatchCenter';
import axiosInstance from '../../utils/axios';
import CustomPaginationXentral from '../../components/molecules/CustomPagination/CustomPaginationXentral';
import ScannerDetectorAssignPacker from '../../components/organisms/ScannerDetector/ScannerDetectorAssignPacker';
import showToast from '../../hooks/useToast';

const DashboardDispatchCenter = () => {
  const [dispatchCenterData, setDispatchCenterData] = useState([]);
  const location = useLocation();
  const {
    navigatePage,
    setPerPage,
    filters: filtersFromOrder,
    columnFilters: columnFiltersFromOrder,
  } = location.state || { navigatePage: 0, setPerPage: 10 };
  const [page, setPage] = useState(navigatePage);
  const [rowsPerPage, setRowsPerPage] = useState(setPerPage);
  const [currentTab, setCurrentTab] = useState(localStorage.getItem('currentTab') || '');
  const [snackBarMessage, setSnackbarMessage] = useState('');
  const [snackBarSeverity, setSnackbarSeverity] = useState('');
  const [open, setOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState(
    columnFiltersFromOrder ? columnFiltersFromOrder : {},
  );
  const [loadingTable, setLoadingTable] = useState(true);
  const [filters, setFilters] = useState({
    filterDate: filtersFromOrder ? filtersFromOrder?.filterDate : false,
    sortBy: filtersFromOrder ? filtersFromOrder?.sortBy : 'desc',
    sortWith: filtersFromOrder ? filtersFromOrder?.sortWith : 'created_at',
    paymentMethod: [],
  });
  const navigate = useNavigate();
  useIdleLogout();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
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

  const handleSortBy = (sort) => {
    if (filters.sortBy === sort.sortBy && filters.sortWith === sort.sortWith) {
      updateFilters({ sortBy: 'asc', sortWith: '' });
    } else {
      updateFilters(sort);
    }
  };

  const fetchDispatchCenter = async (query = ``, rowsPerPageParam = rowsPerPage) => {
    setLoadingTable(true);
    // let filtersQuery = `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : '&sortBy=desc&sortWith=created_at'}`;
    let filtersQuery = `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;
    const filterParams = new URLSearchParams(columnFilters).toString();
    const fullQuery = query + (filterParams ? `&${filterParams}` : '');
    await axiosInstance
      .get(`/dispatch-center/list?${fullQuery}${filtersQuery}`, {
        params: {
          per_page: rowsPerPageParam,
        },
      })
      .then(({ data }) => {
        setDispatchCenterData(data.list);
        setLoadingTable(false);
      })
      .catch((error) => {
        console.error('Error fetching dispatch center:', error);
        setLoadingTable(false);
      });
  };

  const handleChange = async (event, newValue) => {
    setCurrentTab(newValue);
    setPage(0);
    localStorage.setItem('currentTab', newValue);
    const newStatus = newValue === 'fulfilled_orders' ? 1 : '';
    await fetchDispatchCenter(`?fulfilled=${newStatus}`, rowsPerPage);
  };

  const handleChangePage = async (event, newPage) => {
    if (newPage < 0 || newPage >= dispatchCenterData.last_page) {
      return;
    }
    await fetchData(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    await fetchData(0, newRowsPerPage);
  };

  const fetchData = async (newPage, newRowsPerPage) => {
    try {
      const query = `?fulfilled=${currentTab}&page=${newPage + 1}`;
      await fetchDispatchCenter(query, newRowsPerPage);
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRowClick = (orderNo) => {
    const newLocation = {
      ...location,
      pathname: `/dashboard/dispatch-center/${orderNo}`,
    };
    navigate(newLocation, {
      state: {
        navigatePage: page,
        setPerPage: rowsPerPage,
        filters: filters,
        columnFilters: columnFilters,
      },
    });
  };

  const handlePicklistIdScan = async (barcode = '', refetch = () => {}) => {
    console.log('PICKLIST ID: ', barcode.slice(1));
    try {
      console.log('REQUEST STARTED');
      const response = await axiosInstance.post('/picklist/assign-packer', {
        // barcode: barcode != '' ? barcode : searchTerm,
        barcode: barcode.slice(1),
      });
      console.log('REQUEST ENDED');
      console.log(response.data);
      if (response.data.status == 200) {
        showToast('Erfolg', 'success');
      } else if (response.data.status == 404) {
        showToast('Pickliste nicht gefunden', 'failure');
        console.log('STATUS 404');
      }
      refetch();
    } catch (error) {
      console.error('Error scanning barcode:', error);
      showToast('Somthing went wrong!', 'failure');
    }
  };

  const handleFilterChange = (column, value) => {
    setColumnFilters((prevFilters) => {
      if (value === '') {
        const { [column.field]: omit, ...restFilters } = prevFilters;
        return restFilters;
      }
      return {
        ...prevFilters,
        [column.field]: value,
      };
    });
    setPage(0);
  };

  useEffect(() => {
    window.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem('currentTab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    const storedTab = localStorage.getItem('currentTab');
    if (storedTab) {
      setCurrentTab(storedTab);
    }
  }, []);

  useEffect(() => {
    if (currentTab == '') {
      fetchDispatchCenter(`?fulfilled=&page=${page + 1}`);
    } else {
      fetchDispatchCenter(`?fulfilled=1&page=${page + 1}`);
    }
  }, [filters, columnFilters]);

  return (
    <div className="xentral-container">
      {/* <ScannerListener
        onValidString={handleSearch}
        dispatchCenterData={dispatchCenterData}
        setOpen={setOpen}
        setSnackbarSeverity={setSnackbarSeverity}
        setSnackbarMessage={setSnackbarMessage}
      /> */}
      <ScannerDetectorAssignPacker
        handleScan={handlePicklistIdScan}
        refetch={fetchDispatchCenter}
      />

      <Tabs
        className="relative z-0 mb-4  flex w-full items-center border-b border-t bg-white"
        value={currentTab}
        onChange={handleChange}
        sx={{
          '& .MuiTabs-indicator': { backgroundColor: '#4b5563', zIndex: 1 },
          '& .Mui-selected': { color: '#4b5563 !important;', zIndex: 1 },
        }}
      >
        <Tab
          label="Unerfüllte Aufträge"
          value={''}
          sx={{
            textTransform: 'none',
          }}
        />
        <Tab
          label="Erfüllte Aufträge"
          value={'fulfilled_orders'}
          sx={{
            textTransform: 'none',
          }}
        />
      </Tabs>
      <TableContainer component={Paper} className="mt-0">
        <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ height: '80px' }}>
              {DispatchCenter.map((column) => (
                <TableCell
                  sx={{
                    padding: '0px 16px',
                    width: `${column.width}`,
                  }}
                  key={column.field}
                  className="custom-header"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex w-[80%] items-center justify-between">
                      <span
                        style={{
                          width: `${column.width}`,
                          margin: '0px',
                        }}
                        className="text-xs12 font-bold text-black"
                      >
                        {column.headerName}
                      </span>
                      {column.field !== 'expand_action' &&
                        column.field !== 'actions' &&
                        column.field !== 'check' && (
                          <div className="cursor-pointer">
                            <div
                              className={
                                filters.sortBy === 'desc' && filters.sortWith === column.field
                                  ? 'rounded-md bg-accent text-black'
                                  : ''
                              }
                              onClick={() =>
                                handleSortBy({
                                  sortBy: 'desc',
                                  sortWith: column.field,
                                })
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div
                              className={
                                filters.sortBy === 'asc' && filters.sortWith === column.field
                                  ? 'rounded-md bg-accent text-black'
                                  : ''
                              }
                              onClick={() =>
                                handleSortBy({
                                  sortBy: 'asc',
                                  sortWith: column.field,
                                })
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                    </div>
                    {column.field != 'expand_action' &&
                      column.field != 'actions' &&
                      column.field != 'check' && (
                        <input
                          type="text"
                          placeholder={column.placeHolder}
                          className="w-[80%] rounded-lg border border-gray-300 pl-2"
                          value={columnFilters[column.field] || ''}
                          onChange={(e) => handleFilterChange(column, e.target.value)}
                        />
                      )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingTable ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex h-16 items-center justify-center">
                    <PammysLoading />
                  </div>
                </TableCell>
              </TableRow>
            ) : dispatchCenterData?.data?.length == 0 || dispatchCenterData.length <= 0 ? (
              <TableRow className="">
                <TableCell colSpan={6}>
                  <div className="flex h-16 items-center justify-center">
                    <Typography variant="body2" align="center" padding={2}>
                      Keine Daten verfügbar
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {dispatchCenterData?.data?.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        <Link
                          target="_blank"
                          to={`https://admin.shopify.com/store/pummmys/orders/${row?.order?.shopify_order_id}`}
                        >
                          {row?.order_name ? row?.order_name : '-'}
                        </Link>
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {dayjs(row.created_at).format('DD.MM.YYYY')}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {row.customer ? row.customer : '-'}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {row.order_total_items ? row.order_total_items : '-'}
                      </TableCell>

                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {row.is_fulfilled ? 'Erfüllt' : 'Unerfüllte'}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        <div className=" flex h-14 items-center gap-1">
                          <span
                            className="cursor-pointer p-1 "
                            onClick={() => handleRowClick(row?.order_no)}
                          >
                            <EditOrderIcon />
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomPaginationXentral
        page={page}
        pageSize={rowsPerPage}
        total={dispatchCenterData.total || 0}
        handlePageChange={handleChangePage}
        handlePageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
      <Stack className="bg-button" spacing={2} sx={{ width: '100%' }}>
        <Snackbar
          sx={{
            '& .MuiPaper-root': {
              color: '#fff',
              backgroundColor: snackBarSeverity == 'error' ? '#ff7373' : 'rgb(74, 222, 128)',
              padding: '20px',
            },
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert severity={snackBarSeverity}>{snackBarMessage}</Alert>
        </Snackbar>
      </Stack>
    </div>
  );
};
export default DashboardDispatchCenter;
