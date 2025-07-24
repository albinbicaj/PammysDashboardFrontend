import React, { useState } from 'react';
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
export const CustomTable = ({
  page,
  setPage,
  setPageSize,
  pageSize,
  total,
  rows,
  columns,
  loading,
}) => {
  // Extract query parameters from the URL
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
          <TableRow key={1}>
            {columns.map((column) => (
              <TableCell className="custom-header" key={column.id}>
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {loading === true ? (
          <div className=" items-center justify-center">
            <CircularProgress />
          </div>
        ) : rows.length == 0 ? (
          <p variant="body2" align="center" padding={2}>
            Keine Daten verfügbar
          </p>
        ) : (
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                className="custom-row cursor-pointer"
                key={row.id}
                // onClick={() => handleRowClick({ row })}
                onContextMenu={(e) => handleRowRightClick(row, e)}
              >
                {columns.map((column, index) => (
                  <TableCell key={column.id} style={{ padding: 0 }}>
                    <Link
                      to={`/dashboard/order?return_id=${row.barcode_number}`}
                      style={{ display: 'block', width: '100%', height: '100%' }}
                      className="p-4"
                    >
                      {column.field === 'created_at' ? (
                        <div className="text-nowrap">
                          {dayjs(row.created_at).format('DD.MM.YYYY [um] HH:mm')}
                        </div>
                      ) : column.field === 'total_price' ? (
                        convertToDE(row.total_price)
                      ) : column.field === 'status' ? (
                        <div
                          className={`w-max ${
                            row[column.field] === 'requested'
                              ? 'bg-yellow-200 text-yellow-700'
                              : row[column.field] === 'partially'
                                ? 'bg-purple-200 text-purple-600'
                                : row[column.field] === 'approved'
                                  ? 'bg-green-200 text-green-700'
                                  : row[column.field] === 'rejected'
                                    ? // ? 'rejected-item'
                                      'bg-red-200 text-red-600'
                                    : 'bg-green-200 text-green-700'
                          } rounded-full px-2 py-1 text-xs font-medium leading-4`}
                        >
                          <span>{getStatusDE(row[column.field])}</span>
                        </div>
                      ) : column.field === 'type' ? (
                        row[column.field] === TypeEnum.RETURN ? (
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
                        )
                      ) : column.field === 'refund_type' ? (
                        row[column.field] === 'Refund' ? (
                          <span
                            className={`${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}
                          >
                            Rückerstattung
                          </span>
                        ) : (
                          <span
                            className={`${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}
                          >
                            {/* Coupon */}
                            Geschenkcode
                          </span>
                        )
                      ) : (
                        <span className={`${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                          {row[column.field]}
                        </span>
                      )}
                    </Link>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
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
