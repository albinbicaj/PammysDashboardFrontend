import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CloseOrderIcon, DeleteModal, EditOrderIcon } from '../../components/atoms';
import { AddPostModal } from '../../components/organisms';
import { ShippingMethod } from '../../context/ShippingMethod';
import axiosInstance from '../../utils/axios';
import showToast from '../../hooks/useToast';
import CustomPaginationXentral from '../../components/molecules/CustomPagination/CustomPaginationXentral';

const DashboardPostPage = () => {
  const [dataShipping, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postId, setPostId] = useState(false);
  const [filters, setFilters] = useState({
    filterDate: false,
    sortBy: 'asc',
    sortWith: '',
    paymentMethod: [],
  });
  const [columnFilters, setColumnFilters] = useState({});

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getShippingMethod = async (query = '?page=1&paginate=10') => {
    let filtersQuery = `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;
    const { data } = await axiosInstance.get(`/dashboard/shipping-methods${query}${filtersQuery}`);
    setData(data?.shipping_methods);
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    await fetchData(0, newRowsPerPage);
  };

  const handleChangePage = async (event, newPage) => {
    if (newPage < 0 || newPage >= dataShipping.last_page) {
      return;
    }
    await fetchData(newPage, rowsPerPage);
  };

  const fetchData = async (newPage, newRowsPerPage) => {
    try {
      const query = `?page=${newPage + 1}&paginate=${newRowsPerPage}`;
      getShippingMethod(query);
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    try {
      let filtersQuery = `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;
      const query = `?page=${newPage + 1}&paginate=${newRowsPerPage}` + filtersQuery;

      const filterParams = new URLSearchParams(columnFilters).toString();
      const fullQuery = query + (filterParams ? `&${filterParams}` : '');

      getShippingMethod(fullQuery);
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNavigateButtonClick = () => {
    // navigate('/dashboard/post-add');
    setIsModalOpen(true);
    setPostId(null);
  };

  const handleEditPickList = (id) => {
    // navigate(`/dashboard/post-add?id=${id}`);
    setIsModalOpen(true);
    setPostId(id);
  };

  const deletePost = async (id) => {
    try {
      await axiosInstance.delete(`/dashboard/shipping-method/${id}`).then(() => {
        showToast('Versandmethode erfolgreich gelöscht', 'success');
        getShippingMethod();
      });
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      showToast('Error deleting shipping method:', 'failure');
    }
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

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [columnFilters, page, rowsPerPage, filters]);

  return (
    <div className="xentral-container">
      <div className="flex justify-end">
        <div className="btn">
          <button
            onClick={handleNavigateButtonClick}
            className="btn btn-primary flex items-center gap-1 px-3 py-2 "
          >
            +
            <Typography variant="span" component="span">
              Neu
            </Typography>
          </button>
        </div>
      </div>

      <TableContainer component={Paper} className="mt-4">
        <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ height: '60px' }}>
              {ShippingMethod?.map((column) => (
                <TableCell
                  sx={{
                    paddingTop: '0px',
                    paddingBottom: '0px',
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
                    </div>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataShipping?.data?.length == 0 ? (
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
              dataShipping?.data?.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell
                      sx={{
                        paddingTop: '0',
                        paddingBottom: '0',
                      }}
                      align="left"
                    >
                      {row.username ? row.username : '-'}
                    </TableCell>
                    <TableCell
                      sx={{
                        paddingTop: '0',
                        paddingBottom: '0',
                      }}
                      align="left"
                    >
                      {row.shipping_method ? row.shipping_method : '-'}
                    </TableCell>
                    <TableCell
                      sx={{
                        paddingTop: '0',
                        paddingBottom: '0',
                      }}
                      align="left"
                    >
                      {row.product ? row.product : '-'}
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
                          onClick={() => handleEditPickList(row?.id)}
                        >
                          <EditOrderIcon />
                        </span>
                        <DeleteModal
                          className=""
                          confirmButton={() => deletePost(row?.id)}
                          buttonText={
                            <span className="cursor-pointer p-1 ">
                              <CloseOrderIcon />
                            </span>
                          }
                          modalTitle="Are you sure you want to delete"
                          cancelText="Abbrechen"
                          deleteText="Löschen"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomPaginationXentral
        page={page}
        pageSize={rowsPerPage}
        total={dataShipping?.total || 0}
        handlePageChange={handleChangePage}
        handlePageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      <AddPostModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        fetchData={fetchData}
        postId={postId}
      />
    </div>
  );
};
export default DashboardPostPage;
