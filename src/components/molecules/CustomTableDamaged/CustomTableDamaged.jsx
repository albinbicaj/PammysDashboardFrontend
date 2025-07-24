import React from 'react';

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import dayjs from 'dayjs';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import useHistory from react-router-dom
import { convertToDE } from '../../../utils';
import queryString from 'query-string';
import { TypeEnum } from '../../../enums/Type.enum';
import { getStatusDE } from '../../../utils/getStatusDE';

// Helper function to get class name for status
const getStatusClassName = (status) => {
  switch (status) {
    case 'requested':
      return 'bg-yellow-200 text-yellow-700';
    case 'partially':
      return 'bg-purple-200 text-purple-600';
    case 'approved':
      return 'bg-green-200 text-green-700';
    case 'rejected':
      return 'bg-red-200 text-red-600';
    default:
      return 'bg-green-200 text-green-700';
  }
};

const renderColumnField = (column, row, index) => {
  switch (column.field) {
    case 'created_at':
      return (
        <div className="text-nowrap">{dayjs(row.created_at).format('DD.MM.YYYY [um] HH:mm')}</div>
      );
    case 'total_price':
      return convertToDE(row.total_price);
    case 'status':
      return (
        <div
          className={`w-max ${getStatusClassName(row[column.field])} rounded-full px-2 py-1 text-xs font-medium leading-4`}
        >
          <span>{getStatusDE(row[column.field])}</span>
        </div>
      );
    case 'type':
      return row[column.field] === TypeEnum.RETURN ? (
        <div className="text-grey-700 mr-2 mt-2 w-max rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium leading-4">
          Rückgabe
        </div>
      ) : row[column.field] === TypeEnum.EXCHANGE ? (
        <div className="text-grey-700 mr-2 mt-2 w-max rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium leading-4">
          Umtausch
        </div>
      ) : (
        <div className="text-grey-700 mr-2 mt-2 w-max rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium leading-4">
          Rückgabe & Umtausch
        </div>
      );
    case 'refund_type':
      return row[column.field] === 'Refund' ? (
        <span className={`${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}>
          Rückerstattung
        </span>
      ) : (
        <span className={`${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}>
          {/* Coupon */}
          Geschenkcode
        </span>
      );
    default:
      return (
        <span className={`${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}>
          {row[column.field]}
        </span>
      );
  }
};

export const CustomTableDamaged = ({
  page,
  setPage,
  setPageSize,
  pageSize,
  rows,
  columns,
  loading,
  total,
}) => {
  const navigate = useNavigate(); // Get the history object from react-router-dom
  const location = useLocation();
  // Extract query parameters from the URL
  const parsed = queryString.parse(location.search);
  const handleRowClick = (params) => {
    localStorage.setItem('activeTab', parsed.activeTab);
    const existingQueryParams = new URLSearchParams(window.location.search);

    const newQueryParams = new URLSearchParams({ return_id: params.row.barcode_number });

    for (const [key, value] of existingQueryParams) {
      newQueryParams.append(key, value);
    }

    // Log key-value pairs

    navigate(`/dashboard/order?${newQueryParams.toString()}`);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1); // Call the onPageChange prop if provided
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };
  return (
    <>
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
            {columns.map((column) => (
              <TableCell className="custom-header" key={column.id}>
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading === true ? (
            <TableRow className="">
              <TableCell colSpan={columns.length}>
                <div className="flex h-16 items-center justify-center">
                  <CircularProgress />
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
                <TableRow className="custom-row cursor-pointer" key={row.id}>
                  {columns.map((column, index) => (
                    <TableCell key={column.id} style={{ padding: 0 }}>
                      <Link
                        to={`/dashboard/order?return_id=${row.barcode_number}`}
                        style={{ display: 'block', width: '100%', height: '100%' }}
                        className="p-4"
                      >
                        {renderColumnField(column, row, index)}
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center">
        <div className=" mr-auto flex items-center">
          <TablePagination
            component="div"
            count={total}
            page={page - 1}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handlePageSizeChange}
            labelRowsPerPage="Reihen pro Seite:"
          />
        </div>
      </div>
    </>
  );
};
