import React, { useState } from 'react';
import queryString from 'query-string';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
} from '@mui/material';
import dayjs from 'dayjs';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useHistory from react-router-dom
import { convertToDE } from '../../../utils';
import { TypeEnum } from '../../../enums/Type.enum';
export const RefundsTable = ({
  page,
  setPage,
  setPageSize,
  pageSize,
  total,
  rows,
  columns,
  handleCheck,
  selectedForRefund,
  handleCheckAll,
}) => {
  const navigate = useNavigate(); // Get the history object from react-router-dom
  const location = useLocation();
  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1); // Call the onPageChange prop if provided
  };
  console.log(rows);
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };
  // Extract query parameters from the URL
  const parsed = queryString.parse(location.search);
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                onChange={handleCheckAll}
                checked={rows.length > 0 && rows.length == selectedForRefund.length}
              />
            </TableCell>
            {columns.map((column) => {
              return column.field !== 'action' ? (
                <TableCell className="custom-header" key={column.id}>
                  {column.headerName}
                </TableCell>
              ) : null;
            })}
          </TableRow>
        </TableHead>
        {rows.length == 0 ? (
          <p variant="body2" align="center" padding={2}>
            Keine Daten verfügbar
          </p>
        ) : (
          <TableBody>
            {rows.map((row) => (
              <TableRow className="custom-row cursor-pointer" key={row.order_id}>
                {columns.map((column, index) => (
                  <TableCell
                    className={`${column.field === 'type' ? 'return-type' : ''}`}
                    key={column.id}
                  >
                    {column.field === 'action' ? (
                      <Checkbox
                        onChange={(e) => handleCheck(e, row)}
                        checked={selectedForRefund.indexOf(row.barcode_number) !== -1}
                      />
                    ) : column.field === 'created_at' ? (
                      <div className="text-nowrap">
                        {dayjs(row.created_at).format('DD.MM.YYYY [um] HH:mm')}
                      </div>
                    ) : column.field === 'total_price' ? (
                      convertToDE(row.total_price)
                    ) : column.field === 'status' ? (
                      <div
                        className={`w-max ${
                          row[column.field] === 'requested'
                            ? 'bg-orange-200 text-orange-600'
                            : row[column.field] === 'partially'
                              ? 'bg-purple-200 text-purple-600'
                              : row[column.field] === 'approved'
                                ? 'bg-green-200'
                                : 'text-green-600'
                        } rounded-full px-2 py-1 text-xs font-medium leading-4`}
                      >
                        <span>{row[column.field]}</span>
                      </div>
                    ) : column.field === 'type' ? (
                      row[column.field] === TypeEnum.RETURN ? (
                        <div className="text-grey-700 mr-2 mt-2 w-max rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium leading-4">
                          Rücksendung
                        </div>
                      ) : row[column.field] === TypeEnum.EXCHANGE ? (
                        <div className="text-grey-700 mr-2 mt-2 w-max rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium leading-4">
                          Umtausch
                        </div>
                      ) : (
                        <div className="text-grey-700 mr-2 mt-2 w-max rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium leading-4">
                          Rücksendung & Umtausch
                        </div>
                      )
                    ) : (
                      <span className={`${index % 2 === 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                        {row[column.field]}
                      </span>
                    )}
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
