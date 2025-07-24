import React, { useState } from 'react';
import dayjs from 'dayjs';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import Paper from '@mui/material/Paper';

export const StockTable = ({ page, setPage, setPageSize, pageSize, rows, columns }) => {
  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1); // Call the onPageChange prop if provided
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} style={{ width: column.width }}>
                {column.headerName}{' '}
              </TableCell>
            ))}
            <TableCell key="delete" style={{ width: 100 }}>
              Löschen
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      {rows.length == 0 ? (
        <p variant="body2" align="center" padding={2}>
          Keine Daten verfügbar
        </p>
      ) : (
        <TableBody>
          {rows.map((row) => (
            <TableRow
              className="cursor-pointer"
              key={row.id}
              // onClick={() => handleRowClick({ row })}
            >
              {columns.map((column) => (
                <TableCell key={column.id} width={`${column.width}`}>
                  {column.field === 'created_at'
                    ? dayjs(row.created_at).format('DD MMMM  YYYY HH:mm')
                    : row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      )}
      <TablePagination
        component="div"
        count={rows.length}
        page={page - 1}
        onPageChange={handlePageChange}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handlePageSizeChange}
      />
    </Paper>
  );
};
