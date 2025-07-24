import {
  Paper,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { EditOrderIcon } from '../../components/atoms';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
import { DispatchCenter } from '../../context/DispatchCenter';
import CustomPaginationXentral from '../../components/molecules/CustomPagination/CustomPaginationXentral';
import ScannerDetectorAssignPacker from '../../components/organisms/ScannerDetector/ScannerDetectorAssignPacker';
import showToast from '../../hooks/useToast';
import {
  useDispatchCenterData,
  useDispatchCenterDataOrderWithProblems,
} from '../../apiHooks/useOrders';
import axiosInstance from '../../utils/axios';
import useOrderList from '../../hooks/useOrderList';

const DashboardDispatchCenterV2 = () => {
  const location = useLocation();
  const {
    navigatePage,
    setPerPage,
    filters: filtersFromOrder,
    columnFilters: columnFiltersFromOrder,
  } = location.state || { navigatePage: 0, setPerPage: 15 };
  const [page, setPage] = useState(navigatePage);
  const [rowsPerPage, setRowsPerPage] = useState(setPerPage);
  const [currentTab, setCurrentTab] = useState(localStorage.getItem('currentTab') || '');
  const [columnFilters, setColumnFilters] = useState(
    columnFiltersFromOrder ? columnFiltersFromOrder : {},
  );
  const [filters, setFilters] = useState({
    filterDate: filtersFromOrder ? filtersFromOrder?.filterDate : false,
    sortBy: filtersFromOrder ? filtersFromOrder?.sortBy : 'desc',
    sortWith: filtersFromOrder ? filtersFromOrder?.sortWith : 'created_at',
    paymentMethod: [],
  });
  const navigate = useNavigate();
  const [orderLoading, setOrderLoading] = useState(true);
  const { orderList, fetchOrderList } = useOrderList(setOrderLoading);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [redirectOrder, setRedirectOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnassignLoading, setIsUnassignLoading] = useState(false);

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

  const {
    data: dispatchCenterData,
    isLoading: loadingTable,
    refetch,
  } = useDispatchCenterData(
    `fulfilled=${currentTab === 'fulfilled_orders' ? 1 : ''}&page=${page + 1}&per_page=${rowsPerPage}&${new URLSearchParams(columnFilters).toString()}&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}&open=${currentTab === 'open_orders' ? 1 : ''}`,
  );

  const sortOrderParam = filters.sortBy ? `&sort_order=${filters.sortBy}` : '';
  const sortByParam = filters.sortWith ? `&sort_by=${filters.sortWith}` : '';

  const {
    data: dispatchCenterDataOrderWithProblems,
    isLoading: loadingTableOrderWithProblems,
    refetch: refetchOrderWithProblems,
  } = useDispatchCenterDataOrderWithProblems(
    `page=${page + 1}&pagination=${rowsPerPage}&${new URLSearchParams(columnFilters).toString()}${sortOrderParam}${sortByParam}`,
  );

  console.log(dispatchCenterData, 'test');

  const handleChange = async (event, newValue) => {
    setCurrentTab(newValue);
    setPage(0);
    localStorage.setItem('currentTab', newValue);
    setFilters({
      filterDate: false,
      sortBy: 'desc',
      sortWith: 'created_at',
      paymentMethod: [],
    });
    setColumnFilters({});
    setRowsPerPage(15);
    await refetch();
    await refetchOrderWithProblems();
  };

  const handleChangePage = async (event, newPage) => {
    if (
      newPage < 0 ||
      newPage >=
        (currentTab === 'reported_problem_orders'
          ? dispatchCenterDataOrderWithProblems?.orders?.last_page
          : dispatchCenterData?.list?.last_page)
    ) {
      return;
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
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

  const handlePicklistIdScan = async (barcode = '') => {
    try {
      const response = await axiosInstance.post('/picklist/assign-packer', {
        pallet_id: barcode,
      });
      if (response.data.status === 200) {
        showToast('Erfolg', 'success');
        setScanSuccess(true);
        await fetchOrderList();
        await refetch();
        setRedirectOrder(true);
      } else if (response.data.status === 404) {
        showToast('Pickliste nicht gefunden', 'failure');
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      showToast('Something went wrong!', 'failure');
    }
  };

  useEffect(() => {
    if (scanSuccess && redirectOrder) {
      if (orderList?.length > 0) {
        navigate(`/dashboard/dispatch-center/${orderList[0]?.order_no}`);
      } else {
        navigate('/dashboard/dispatch-center');
        showToast('Pickliste is finished', 'failure');
      }
      setRedirectOrder(false);
    }
  }, [scanSuccess, redirectOrder, orderList, navigate]);

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
    refetch();
    refetchOrderWithProblems();
  }, [filters, columnFilters, page, rowsPerPage]);

  const handleNextPicklist = async (picklist_id) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/dispatch-center/check-picklist-status', {
        picklist_id: picklist_id || dispatchCenterData?.picklist_id,
      });
      if (response.data.status === 200) {
        showToast('Picklist marked as fulfilled', 'success');
        await fetchOrderList();
        await refetch();
      } else {
        showToast('Failed to mark this Picklist', 'failure');
      }
    } catch (error) {
      showToast('Something went wrong!', 'failure');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassignPicklist = async (picklist_id) => {
    setIsUnassignLoading(true);
    try {
      const response = await axiosInstance.post('/picklist/unassign-picklist', {
        picklist_id: picklist_id,
      });
      if (response.data.status === 200) {
        showToast('Successfully unassigned Picklist', 'success');
        await fetchOrderList();
        await refetch();
      } else {
        showToast('Failed to unassign this Picklist', 'failure');
      }
    } catch (error) {
      showToast('Something went wrong!', 'failure');
    } finally {
      setIsUnassignLoading(false);
    }
  };

  const allOrdersFulfilled = dispatchCenterData?.picklist_id;
  const emptyUnfullfilledOrders = dispatchCenterData?.list?.data?.length > 0;

  return (
    <div className="xentral-container">
      <ScannerDetectorAssignPacker handleScan={handlePicklistIdScan} refetch={refetch} />

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
          label="Open Orders"
          value={'open_orders'}
          sx={{
            textTransform: 'none',
          }}
        />
        <Tab
          label="Reported Problem Orders"
          value={'reported_problem_orders'}
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

      {currentTab === '' ? (
        <div>
          <div className="flex justify-end space-x-4 pb-4">
            {emptyUnfullfilledOrders && (
              <button
                className="rounded bg-gray-300 px-4 py-2 font-normal text-[#000] hover:bg-[#C1C5CD]"
                onClick={() =>
                  handleUnassignPicklist(dispatchCenterData?.list?.data[0]?.picklist_id)
                }
              >
                {isUnassignLoading ? <PammysLoading height={5} width={5} /> : 'Unassign Picklist'}
              </button>
            )}
            {allOrdersFulfilled && (
              <button
                className="rounded bg-accent px-4 py-2 font-normal text-[#000] hover:bg-accent-dark"
                onClick={() => handleNextPicklist(dispatchCenterData?.list?.data[0]?.picklist_id)}
              >
                {isLoading ? (
                  <PammysLoading height={5} width={5} />
                ) : (
                  'Mark this picklist as fulfilled'
                )}
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4 pb-12">
            {loadingTable || orderLoading ? (
              <div className="col-span-3 flex items-center justify-center">
                <PammysLoading />
              </div>
            ) : (
              <>
                {dispatchCenterData?.list?.data?.map((row, index) => (
                  <div
                    key={row.id}
                    className={`border-[5px] ${row?.is_fulfilled === 1 && row?.problem === 0 ? 'border-green-600' : row?.problem === 1 ? 'border-orange-400' : 'border-red-600'} bg-[#e5e7eb] p-4 text-center`}
                  >
                    <div className="flex h-5 items-center justify-end gap-1">
                      <span
                        className="cursor-pointer p-1"
                        onClick={() => handleRowClick(row?.order_no)}
                      >
                        <EditOrderIcon />
                      </span>
                    </div>
                    <Link
                      target="_blank"
                      to={`https://admin.shopify.com/store/pummmys/orders/${row?.shopify_order_id}`}
                    >
                      <Typography variant="p" component="p">
                        {row?.order_name ? row?.order_name : '-'}
                      </Typography>
                    </Link>
                    <Typography variant="p" component="p">
                      {dayjs(row.created_at).format('DD.MM.YYYY')}
                    </Typography>
                    <Typography variant="p" component="p">
                      {row.customer ? row.customer : '-'}
                    </Typography>
                    <Typography variant="p" component="p">
                      {row.order_total_items ? row.order_total_items : '-'}
                    </Typography>
                    <Typography variant="p" component="p">
                      {row.is_fulfilled ? 'Erfüllt' : 'Unerfüllte'}
                    </Typography>
                  </div>
                ))}
                {[...Array(15 - (dispatchCenterData?.list?.data?.length || 0))].map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="border-[5px] border-gray-300 bg-[#e5e7eb] p-[5rem] text-center"
                  ></div>
                ))}
              </>
            )}
          </div>
        </div>
      ) : (
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
              {currentTab === 'reported_problem_orders' ? (
                loadingTableOrderWithProblems ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="flex h-16 items-center justify-center">
                        <PammysLoading />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : dispatchCenterDataOrderWithProblems?.orders?.data?.length === 0 ? (
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
                  dispatchCenterDataOrderWithProblems?.orders?.data?.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        <Link
                          target="_blank"
                          to={`https://admin.shopify.com/store/pummmys/orders/${row?.shopify_order_id}`}
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
                        {row.is_fulfilled ? 'Erfüllt' : 'Unerfüllt'}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        <div className="flex h-14 items-center gap-1">
                          <span
                            className="cursor-pointer p-1"
                            onClick={() => handleRowClick(row?.order_no)}
                          >
                            <EditOrderIcon />
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : loadingTable ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex h-16 items-center justify-center">
                      <PammysLoading />
                    </div>
                  </TableCell>
                </TableRow>
              ) : dispatchCenterData?.list?.data?.length === 0 ? (
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
                dispatchCenterData?.list?.data?.map((row) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell
                      sx={{
                        paddingTop: '0',
                        paddingBottom: '0',
                      }}
                      align="left"
                    >
                      <Link
                        target="_blank"
                        to={`https://admin.shopify.com/store/pummmys/orders/${row?.shopify_order_id}`}
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
                      {row.is_fulfilled ? 'Erfüllt' : 'Unerfüllt'}
                    </TableCell>
                    <TableCell
                      sx={{
                        paddingTop: '0',
                        paddingBottom: '0',
                      }}
                      align="left"
                    >
                      <div className="flex h-14 items-center gap-1">
                        <span
                          className="cursor-pointer p-1"
                          onClick={() => handleRowClick(row?.order_no)}
                        >
                          <EditOrderIcon />
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {currentTab !== '' && (
        <CustomPaginationXentral
          page={page}
          pageSize={rowsPerPage}
          total={
            currentTab === 'reported_problem_orders'
              ? dispatchCenterDataOrderWithProblems?.orders?.total || 0
              : dispatchCenterData?.list?.total || 0
          }
          handlePageChange={handleChangePage}
          handlePageSizeChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[15, 25, 50, 100]}
        />
      )}
    </div>
  );
};

export default DashboardDispatchCenterV2;
