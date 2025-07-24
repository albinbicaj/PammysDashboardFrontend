import React from 'react';
import { TablePagination, Pagination } from '@mui/material';

const CustomPagination = ({
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
      <div className="CRT-PD flex items-center justify-between bg-white pr-3">
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
          count={Math.ceil(Number(total) / Number(pageSize))} // Ensure total and pageSize are numbers
          page={Number(page) || 1} // Convert page to number and default to 1 if it's invalid
          onChange={(event, value) => handlePageChange(event, value - 1)}
          boundaryCount={Number(boundaryCount) || 1} // Convert boundaryCount to number, with a default fallback
          siblingCount={Number(siblingCount) || 1} // Convert siblingCount to number, with a default fallback
          showFirstButton={!!showFirstButton} // Ensure it's a boolean
          showLastButton={!!showLastButton} // Ensure it's a boolean
        />
        {/* <Pagination
          count={Math.ceil(total / pageSize)} // Total pages
          page={page} // Pagination component is 1-indexed
          onChange={(event, value) => handlePageChange(event, value - 1)}
          boundaryCount={boundaryCount}
          siblingCount={siblingCount}
          showFirstButton={showFirstButton}
          showLastButton={showLastButton}
        /> */}
      </div>
      {total !== 0 ? (
        <div className="px-6 py-4">
          Total: <span className="font-semibold">{total}</span>
        </div>
      ) : null}
    </>
  );
};

export default CustomPagination;
