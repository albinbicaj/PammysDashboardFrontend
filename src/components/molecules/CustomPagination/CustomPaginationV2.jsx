import React from 'react';
import { TablePagination, Pagination } from '@mui/material';

const CustomPaginationV2 = ({
  filters = {},
  updateFilters = () => {},
  total = 0,
  rowsPerPageOptions = [10, 15, 25, 50],
  boundaryCount = 1,
  siblingCount = 7,
  showFirstButton = true,
  showLastButton = true,
  labelRowsPerPage = 'Reihen pro Seite:',
}) => {
  const pageHandler = (_e, value) => {
    updateFilters({ page: value });
  };
  const paginationHandler = (_e) => {
    updateFilters({ perPage: _e.target.value });
  };

  return (
    <>
      <div className="CRT-PD flex items-center justify-between border bg-white pr-3">
        <TablePagination
          component="div"
          rowsPerPage={filters.perPage || 10}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={paginationHandler}
          labelRowsPerPage={labelRowsPerPage}
          classes={{
            toolbar: 'hidden',
            spacer: 'hidden',
            actions: 'hidden',
          }}
        />
        <Pagination
          count={Math.ceil(Number(total) / Number(filters.perPage))} // Ensure total and pageSize are numbers
          page={Number(filters.page) || 1} // Convert page to number and default to 1 if it's invalid
          onChange={pageHandler}
          boundaryCount={Number(boundaryCount) || 1} // Convert boundaryCount to number, with a default fallback
          siblingCount={Number(siblingCount) || 1} // Convert siblingCount to number, with a default fallback
          showFirstButton={!!showFirstButton} // Ensure it's a boolean
          showLastButton={!!showLastButton} // Ensure it's a boolean
        />
      </div>
      <div className="p-6">
        Total:
        <span className="pl-3 font-semibold">{total !== 0 ? total : 0}</span>
      </div>
    </>
  );
};

export default CustomPaginationV2;
