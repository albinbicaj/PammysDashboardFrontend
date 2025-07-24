import React from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  styled,
  tableCellClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import { CloseOrderIcon } from '../../components/atoms';
import { Pickercolumns } from '../../context/Pickercolumns';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
import CustomPaginationXentral from '../../components/molecules/CustomPagination/CustomPaginationXentral';

const DashboardUIPickerPage = ({
  handleBarcodeScan,
  activeTab,
  scannerRef,
  scannerPaused,
  scannerColor,
  scannedUserId,
  scannedBarcode,
  handleChange,
  pickerData,
  filters,
  columnFilters,
  handleFilterChange,
  loadingTable,
  toggleRow,
  handleSortBy,
  handleChangePage,
  handleChangeRowsPerPage,
  page,
  rowsPerPage,
  handleDeletePicker,
  openRows,
  showNotification,
}) => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f3f4f6',
      color: theme.palette.common.black,
      paddingTop: '0',
      paddingBottom: '0',
      textAlign: 'left',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  return (
    <div className="xentral-container" tabIndex={0} onKeyPress={handleBarcodeScan}>
      <div
        className={`border-[rgba(224, 224, 224, 1)]  mb-4 mt-5 items-center ${activeTab === 'register_picker' ? 'flex justify-center' : 'hidden justify-start'} border bg-white p-4`}
      >
        {activeTab === 'register_picker' && (
          <>
            <div className="scanner-wrapper relative flex h-[600px] w-[600px] items-center justify-center rounded-lg">
              <div className="h-[600px] w-[600px] scale-x-[-1]">
                <Scanner
                  ref={scannerRef}
                  onScan={handleBarcodeScan}
                  scanDelay={2000}
                  allowMultiple={true}
                  onError={(err) => console.error('Scan error:', err)}
                  paused={scannerPaused}
                  formats={[
                    'aztec',
                    'codabar',
                    'code_39',
                    'code_93',
                    'code_128',
                    'data_matrix',
                    'maxi_code',
                    'databar',
                    'micro_qr_code',
                    'databar_expanded',
                    'pdf417',
                    'dx_film_edge',
                    'qr_code',
                    'ean_8',
                    'ean_13',
                    'itf',
                    'linear_codes',
                    'upc_a',
                    'upc_e',
                  ]}
                />
              </div>
              <style jsx>{`
                .scanner-wrapper svg {
                  display: none !important;
                }
              `}</style>
              <div className={`absolute inset-0 border-[10px] ${scannerColor} rounded-lg`}></div>
              <div className="absolute h-full w-full">
                <div
                  className={`absolute left-0 top-0 h-6 w-6 border-l-4 border-t-4 ${scannerColor}`}
                ></div>
                <div
                  className={`absolute right-0 top-0 h-6 w-6 border-r-4 border-t-4 ${scannerColor}`}
                ></div>
                <div
                  className={`absolute bottom-0 left-0 h-6 w-6 border-b-4 border-l-4 ${scannerColor}`}
                ></div>
                <div
                  className={`absolute bottom-0 right-0 h-6 w-6 border-b-4 border-r-4 ${scannerColor}`}
                ></div>
              </div>
              <div className="absolute bottom-2 left-2 rounded bg-white p-2 text-sm shadow">
                {scannedUserId && (
                  <div>
                    <strong>QR User ID:</strong> {scannedUserId}
                  </div>
                )}
                {scannedBarcode && (
                  <div>
                    <strong>Barcode:</strong> {scannedBarcode}
                  </div>
                )}
                {(!scannedUserId || !scannedBarcode) && <div>Bitte scannen Sie beide Codes</div>}
              </div>
              {showNotification && (
                <div className="absolute left-2 top-2 rounded bg-orange-500 p-2 text-sm text-white shadow">
                  Ein Code wurde gescannt. Bitte scannen Sie den anderen Code.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="relative z-0 mb-5 flex items-center justify-between border bg-white pr-4">
        <Tabs
          className="flex w-full items-center "
          value={activeTab}
          onChange={handleChange}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#4b5563', zIndex: 1 },
            '& .Mui-selected': { color: '#4b5563 !important;', zIndex: 1 },
            flex: 1,
          }}
        >
          <Tab
            label="Register picker"
            value={'register_picker'}
            sx={{
              textTransform: 'none',
            }}
          />
          <Tab
            label="Alle Pflücker"
            value={'all_pickers'}
            sx={{
              textTransform: 'none',
            }}
          />
        </Tabs>
      </div>

      <TableContainer component={Paper} className="mt-0">
        <Table sx={{ minWidth: 650 }} aria-label="collapsible table" checkboxselection="true">
          <TableHead>
            <TableRow sx={{ height: '80px' }}>
              {pickerData?.list?.data?.length != 0 && (
                <TableCell sx={{ padding: '0px', width: '40px' }}></TableCell>
              )}

              {Pickercolumns?.map((column) => (
                <TableCell
                  sx={{
                    padding: '0px 16px',
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
                      {column.field !== 'expand_action' &&
                        column.field !== 'actions' &&
                        column.field !== 'check' && (
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
                    {column.field != 'expand_action' &&
                      column.field != 'actions' &&
                      column.field != 'check' && (
                        <input
                          type="text"
                          placeholder={`Filter ${column.headerName}`}
                          className="w-[80%] rounded-lg border border-gray-300 pl-2 "
                          value={columnFilters[column.field] || ''}
                          onChange={(e) => handleFilterChange(column, e.target.value)}
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
            ) : pickerData?.list?.data?.length == 0 || pickerData?.list?.data?.length <= 0 ? (
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
                {pickerData?.list?.data?.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingRight: '0',
                          paddingBottom: '0',
                          width: '50px',
                        }}
                        onClick={() => toggleRow(row.id)}
                      >
                        <IconButton aria-label="expand row" size="small">
                          {openRows.includes(row.id) ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {row?.id}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {dayjs(row?.rule?.created_at).format('DD MMM,  YYYY')}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {row?.picker_name}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {row?.rule?.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        {row?.total_orders}
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
                            onClick={() => handleDeletePicker(row)}
                          >
                            <CloseOrderIcon />
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                        <Collapse in={openRows.includes(row.id)} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1, paddingTop: 1, paddingBottom: 1 }}>
                            <Typography variant="p" gutterBottom component="p" fontWeight="bold">
                              Bestellungen
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Bestellung</StyledTableCell>
                                  <StyledTableCell>Kunde</StyledTableCell>
                                  <StyledTableCell>Produkte insgesamt</StyledTableCell>
                                  <StyledTableCell>Erfüllt</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row?.dispatch_center?.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item?.order_name}</TableCell>
                                    <TableCell>{item?.customer}</TableCell>
                                    <TableCell>{item?.order_total_items}</TableCell>
                                    <TableCell>
                                      {item?.is_fulfilled == 1 ? 'Erfüllt' : 'Unerfüllte'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {activeTab == 'all_pickers' && (
        <CustomPaginationXentral
          page={page}
          pageSize={rowsPerPage}
          total={pickerData?.list?.total || 0}
          handlePageChange={handleChangePage}
          handlePageSizeChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      )}
    </div>
  );
};

export default DashboardUIPickerPage;
