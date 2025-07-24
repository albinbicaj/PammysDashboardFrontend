import React from 'react';
import { TablePagination, Pagination } from '@mui/material';

const CustomPaginationXentral = ({
  page = 1,
  pageSize = 10,
  total = 0,
  handlePageChange = () => {},
  handlePageSizeChange = () => {},
  rowsPerPageOptions = [10, 25, 50],
  boundaryCount = 1,
  siblingCount = 7,
  showFirstButton = true,
  showLastButton = true,
  labelRowsPerPage = 'Reihen pro Seite:',
}) => {
  return (
    <>
      <div className="CRT-PD flex items-center justify-between border-b border-l border-r bg-white pr-3">
        <TablePagination
          component="div"
          rowsPerPage={pageSize}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={handlePageSizeChange}
          labelRowsPerPage={labelRowsPerPage}
          classes={{
            toolbar: 'hidden',
            spacer: 'hidden',
            actions: 'hidden',
          }}
        />
        <Pagination
          count={Math.ceil(total / pageSize)} // Total pages
          page={page + 1} // Convert 0-indexed page to 1-indexed for Pagination component
          onChange={(event, value) => handlePageChange(event, value - 1)} // Convert 1-indexed to 0-indexed
          boundaryCount={boundaryCount}
          siblingCount={siblingCount}
          showFirstButton={showFirstButton}
          showLastButton={showLastButton}
        />
      </div>
      {total !== 0 ? (
        <div className="px-6 py-4">
          Total: <span className="font-semibold">{total}</span>
        </div>
      ) : null}
    </>
  );
};

export default CustomPaginationXentral;
