import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom'; // Import useHistory from react-router-dom
import { convertToDE } from '../../../utils';
import { TypeEnum } from '../../../enums/Type.enum';
import { getStatusDE } from '../../../utils/getStatusDE';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';
import CustomPagination from '../CustomPagination/CustomPagination';

const checkItemReasons = (itemReasons) => {
  const reasonsArray = itemReasons.split(',').map(Number);
  const has5 = reasonsArray.includes(5);
  const has7 = reasonsArray.includes(7);

  if (has5 && has7) {
    return 'FL / RE';
  } else if (has5) {
    return 'RE';
  } else if (has7) {
    return 'FL';
  } else {
    return '';
  }
};

// Helper function to get class name for status
const getStatusClassName = (status) => {
  const switchStatus = status.toLowerCase();
  switch (switchStatus) {
    case 'requested':
      return 'bg-yellow-200 text-yellow-700';
    case 'partially':
      return 'bg-purple-200 text-purple-600';
    case 'approved':
      return 'bg-green-200 text-green-700';
    case 'rejected':
      return 'bg-red-200 text-red-600';
    case 'archived':
      return 'bg-gray-200 text-gray-600';
    default:
      return 'bg-green-200 text-green-700';
  }
};

export const CustomReturnsTable = ({
  page,
  setPage,
  setPageSize,
  pageSize,
  rows,
  columns,
  loading,
  isFetching = false,
  total,
  selectedForRefund,
  handleCheck,
  handleCheckAll,
  filters,
  updateFilters,
}) => {
  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1); // Call the onPageChange prop if provided
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };

  const handleSortBy = (sort) => {
    console.log(sort);
    if (filters.sortBy === sort.sortBy && filters.sortWith === sort.sortWith) {
      updateFilters({ sortBy: 'asc', sortWith: '' });
    } else {
      // If it doesn't match, update with the new sort
      updateFilters({
        sortBy: sort.sortBy,
        sortWith: sort.sortWith,
      });
    }
  };
  const renderColumnField = (column, row, index) => {
    switch (column.field) {
      case 'action':
        return (
          <div className="px-4">
            <Checkbox
              onChange={(e) => handleCheck(e, row)}
              checked={selectedForRefund.indexOf(row.barcode_number) !== -1}
            />
          </div>
        );
      case 'refund_created_at':
        return (
          <Link
            to={`/dashboard/order?return_id=${row.barcode_number}`}
            className="custom-table-cell p-4"
          >
            <div className="text-nowrap">
              {dayjs(row.refund_created_at).format('DD.MM.YYYY [um] HH:mm')}
            </div>
          </Link>
        );
      case 'created_at':
        return (
          <Link
            to={`/dashboard/order?return_id=${row.barcode_number}`}
            className="custom-table-cell p-4"
          >
            <div className="text-nowrap">
              {dayjs(row.created_at).format('DD.MM.YYYY [um] HH:mm')}
            </div>
          </Link>
        );
      case 'barcode_number':
        return (
          <Link
            to={`/dashboard/order?return_id=${row[column.field]}`}
            target="_blank"
            className="custom-table-cell p-4"
          >
            {row[column.field]}
          </Link>
        );
      case 'order_number':
        return (
          <Link to={`${row.shopify_order_path}`} target="_blank" className="custom-table-cell p-4">
            {row[column.field]}
          </Link>
        );
      case 'total_price':
        return (
          <Link to={`/dashboard/order?return_id=${row.barcode_number}`} className="p-4">
            {convertToDE(row.total_price)}
          </Link>
        );
      case 'status':
        return (
          <Link
            to={`/dashboard/order?return_id=${row.barcode_number}`}
            className="custom-table-cell p-4"
          >
            <div className={`w-max ${getStatusClassName(row[column.field])} badge`}>
              <span>{getStatusDE(row[column.field])}</span>
            </div>
          </Link>
        );
      case 'type':
        return (
          <Link
            to={`/dashboard/order?return_id=${row.barcode_number}`}
            className="custom-table-cell p-4"
          >
            <div className="badge-neutral">
              {row[column.field] === TypeEnum.RETURN ? (
                <>Rückgabe</>
              ) : row[column.field] === TypeEnum.EXCHANGE ? (
                <>Umtausch</>
              ) : (
                <>Rückgabe & Umtausch</>
              )}{' '}
              {checkItemReasons(row?.item_reasons || '')}
            </div>
          </Link>
        );
      case 'refund_type':
        return (
          <Link
            to={`/dashboard/order?return_id=${row.barcode_number}`}
            className="custom-table-cell p-4"
          >
            {row[column.field] === 'Gift Card' ? (
              <span className={`${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                Geschenkcode
              </span>
            ) : (
              <span className={`${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                Rückerstattung
              </span>
            )}
          </Link>
        );
      default:
        return (
          <Link
            to={`/dashboard/order?return_id=${row.barcode_number}`}
            className={`custom-table-cell p-4 ${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}
          >
            {row[column.field]}
          </Link>
        );
    }
  };

  return (
    <div className="">
      <Table
        sx={{
          [`& .${tableCellClasses.root}`]: {
            // border: 'none',
          },
        }}
        className="bg-white"
      >
        <TableHead>
          <TableRow>
            {columns.map((column, id) =>
              column.field === 'action' ? (
                <TableCell className="custom-header" key={`IkicnkoF-${id}`}>
                  <Checkbox
                    onChange={handleCheckAll}
                    checked={rows.length > 0 && rows.length === selectedForRefund.length}
                  />
                </TableCell>
              ) : (
                <TableCell className="custom-header" key={`IkicnkoF-${id}`}>
                  <div className="flex items-center gap-3">
                    <p>{column.headerName}</p>
                    {column.sort === true && (
                      <div className="cursor-pointer">
                        {/* Sort descending */}
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
                        {/* Sort ascending */}
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
                </TableCell>
              ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="flex h-16 items-center justify-center">
                  <PammysLoading />
                </div>
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="flex h-16 items-center justify-center">
                  <p variant="body2" align="center" padding={2}>
                    Keine Daten verfügbar
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow className="custom-row cursor-pointer" key={row.barcode_number}>
                {' '}
                {/* Use row's unique ID */}
                {columns.map((column) => (
                  <TableCell key={column.field} style={{ padding: 0 }}>
                    {' '}
                    {/* Use column.field as key */}
                    {renderColumnField(column, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
        {/* <TableBody>
            {loading === true ? (
              <TableRow className="">
                <TableCell colSpan={columns.length}>
                  <div className="flex h-16 items-center justify-center">
                    <PammysLoading />
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length == 0 ? (
              <TableRow className="">
                <TableCell colSpan={columns.length}>
                  <div className="flex h-16 items-center justify-center">
                    <p variant="body2" align="center" padding={2}>
                      Keine Daten verfügbar
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {rows.map((row, index) => (
                  <TableRow className="custom-row cursor-pointer" key={`IkiDbloc-${index}`}>
                    {columns.map((column, index) => (
                      <TableCell key={column.id} style={{ padding: 0 }}>
                        {renderColumnField(column, row, index, selectedForRefund, handleCheck)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody> */}
      </Table>
      {/* <div className="CRT-PD flex items-center justify-between bg-white pr-3">
          <TablePagination
            component="div"
            rowsPerPage={pageSize}
            rowsPerPageOptions={[10, 25, 50]}
            onRowsPerPageChange={handlePageSizeChange}
            labelRowsPerPage="Reihen pro Seite:"
            // Hide navigation controls
            classes={{
              toolbar: 'hidden',
              spacer: 'hidden',
              actions: 'hidden',
            }}
          />
          <Pagination
            count={Math.ceil(total / pageSize)} // Total pages
            page={page} // Pagination component is 1-indexed
            onChange={(event, value) => handlePageChange(event, value - 1)}
            boundaryCount={1}
            siblingCount={7}
            showFirstButton={true}
            showLastButton={true}
          />
        </div>
        <div className="px-6 py-4  ">
          Total: <span className="font-semibold">{total}</span>
        </div> */}
      <CustomPagination
        page={page}
        pageSize={pageSize}
        total={total}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        rowsPerPageOptions={[10, 25, 50]} // Customize as needed
        boundaryCount={1} // Customize as needed
        siblingCount={7} // Customize as needed
        showFirstButton={true} // Customize as needed
        showLastButton={true} // Customize as needed
        labelRowsPerPage="Reihen pro Seite:" // Customize as needed
      />
    </div>
  );
};
