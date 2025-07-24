import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import dayjs from 'dayjs';
import {
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { CloseOrderIcon, DeleteIcon, DeleteModal, EditOrderIcon } from '../../atoms';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';
import axiosInstance from '../../../utils/axios';
import showToast from '../../../hooks/useToast';
import CustomPaginationXentral from '../CustomPagination/CustomPaginationXentral';
export const PickListTableRule = ({
  PickListColumns,
  toggleRow,
  StyledTableCell,
  columnFilters,
  fetchedPickedList,
  openRows,
  rowsPerPage,
  page,
  setPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEditPickList,
  handleDeletePickList,
  setFilters,
  filters,
  setColumnFilters,
  loadingTable,
  fetchData,
}) => {
  const updateFilters = (fieldsToUpdate) => {
    setFilters((prevContext) => {
      let updatedContext = { ...prevContext };
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        updatedContext[key] = value;
      }
      return updatedContext;
    });
    setPage(0);
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

  const deletePicklist = async (id) => {
    try {
      await axiosInstance.delete(`/picklist/delete-rule/${id}`);
      showToast('Erfolgreich', 'success');
      await fetchData(page, rowsPerPage);
    } catch (error) {
      showToast('Die Auswahllistenregel konnte nicht gelöscht werden', 'failure');
      console.error('Error deleting pick list:', error);
    }
    setPage(0);
  };

  const handleSortBy = (sort) => {
    if (filters.sortBy === sort.sortBy && filters.sortWith === sort.sortWith) {
      updateFilters({ sortBy: 'asc', sortWith: '' });
    } else {
      updateFilters(sort);
    }
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper} className="mt-0">
        <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ height: '80px' }}>
              {PickListColumns?.map((column) => (
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
                      {column.field !== 'expand_action' && column.field !== 'actions' && (
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
                    {column.field != 'expand_action' && column.field != 'actions' && (
                      <input
                        type="text"
                        placeholder={`Filter ${column.headerName}`}
                        value={columnFilters[column.field] || ''}
                        onChange={(e) => handleFilterChange(column, e.target.value)}
                        className="w-[80%] rounded-lg border border-gray-300 pl-2 "
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
            ) : fetchedPickedList?.rules?.data?.length == 0 || fetchedPickedList?.length <= 0 ? (
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
                {fetchedPickedList?.rules?.data?.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      onClick={() => toggleRow(row.id)}
                    >
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
                        {row.name ? row.name : '-'}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {row.active === 1 ? 'ja' : '-'}
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
                            onClick={() => handleEditPickList(row)}
                          >
                            <EditOrderIcon />
                          </span>
                          <DeleteModal
                            className=""
                            confirmButton={() => deletePicklist(row?.id)}
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
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse
                          in={openRows.includes(row.id)}
                          timeout="auto"
                          unmountOnExit
                        ></Collapse>
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
        total={fetchedPickedList?.rules?.total || 0}
        handlePageChange={handleChangePage}
        handlePageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </>
  );
};
