import { productColumns } from '../../../context/productsColumns';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Alert,
  Box,
  Collapse,
  IconButton,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CloseOrderIcon, EditOrderIcon } from '../../atoms';
import { EditProductModal, QuantityProductsModal } from '../../organisms';
import CopyToClipboard from 'react-copy-to-clipboard';
import PermissionCheck from '../PermissionCheck/PermissionCheck';
import { RoleEnum } from '../../../enums/Role.enum';
import { IconDotsVertical, IconX, IconXboxX } from '@tabler/icons-react';
import DownloadCSVButton from '../../atoms/DownloadCSVButton/DownloadCSVButton';
import { SortButtons } from '../../../pages/Dashboard/components/DynamicReturnTable/components/SortButtons';
import { LoadingTablePlaceholder } from '../../../pages/Dashboard/components/DynamicReturnTable/components/LoadingTablePlaceholder';
import SyncShopifyProductForm from '../../../pages/DashboardProductsPage/components/SyncShopifyProductForm';

const QueryStringReader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryString = location.search.substring(1); // removes '?'
  const handleReset = () => {
    navigate(location.pathname); // removes query string
    console.log(location.pathname);
  };
  return (
    <div>
      <button
        className={`${queryString.length !== 0 ? 'btn-primary' : 'btn-secondary'} btn `}
        onClick={handleReset}
      >
        Reset filters
      </button>
    </div>
  );
};

function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button onClick={() => setOpen(!open)} className="btn btn-secondary px-2">
        <IconDotsVertical />
      </button>

      {/* {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg">
          <ul className="py-1 text-gray-700">
            <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">Profile</li>
            <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">Settings</li>
            <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">Logout</li>
          </ul>
        </div>
      )} */}
      {open && (
        <div className="absolute right-0 z-10 mt-2 flex w-60 flex-col gap-2 rounded-md bg-white p-2 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}
const ProductsTableV2UI = ({
  isDraggingFile,
  getRootProps,
  isDragAccept,
  isDragReject,
  isDragActive,
  loadingCSV,
  file,
  getInputProps,
  setFile,
  handleUpload,
  rows,
  filtersV2,
  updateFiltersV2,
  loadingTable,
  toggleRow,
  openRows,
  handleCopy,
  handleEditProduct,
  handleQuantityChange,
  storageLocations,
  formatStorageLocation,
  handleInputChange,
  handleWeightInputChange,
  openModal,
  setOpenModal,
  calculationState,
  setIsCheckboxError,
  reset,
  quantityToUpdate,
  setQuantityToUpdate,
  control,
  validateCheckboxes,
  isCheckboxError,
  saving,
  handleModalSave,
  fetchProducts,
  columns,
  isModalOpen2,
  handleCloseModal2,
  productId,
  state,
  handleClose,
  copied,
  weightLocations,
  queryStringUseQuery,
}) => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#e0e0e0',
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
    <>
      {isDraggingFile ? (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-[50] bg-gray-300 bg-opacity-90 p-16">
          <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-gray-400">
            <div
              {...getRootProps({
                className: 'dropzone w-full h-full bg-white/30 flex items-center justify-center',
              })}
            >
              <input {...getInputProps()} className="hidden" />
              {isDragAccept && <p className="text-xl">All files will be accepted</p>}
              {isDragReject && <p className="text-xl">Some files will be rejected</p>}
              {!isDragActive && <p className="text-xl">Drop some files here ...</p>}
            </div>
          </div>
        </div>
      ) : null}
      <PermissionCheck
        roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE, RoleEnum.SUPPORT, RoleEnum.IEM]}
      >
        <div className="mb-4 flex items-center justify-between border bg-white px-4 py-4">
          <div className="flex">
            <div className="ml-4 flex items-center gap-3">
              <Typography variant="span" component="span" fontWeight="bold">
                CSV-DATEI:
              </Typography>
              <label for="file-upload" className="custom-file-upload rounded-lg">
                {loadingCSV
                  ? 'Hochgeladen werden...'
                  : file
                    ? file.name + ' datei hochgeladen'
                    : 'CSV hier hochladen'}
              </label>
              <input
                className="ml-2 w-[52%]"
                id="file-upload"
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  console.log(e.target.files[0]);
                }}
              />
              <Tooltip placement="top" title={!file ? 'Datei hochladen' : null}>
                <button
                  className={`${!file ? 'cursor-not-allowed' : 'cursor-pointer'} btn btn-primary`}
                  onClick={handleUpload}
                  disabled={!file}
                >
                  {loadingCSV ? 'Laden...' : 'Einreichen'}
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="flex gap-2">
            {/* <button className="btn btn-primary" onClick={handleFetchDiscounts}>
              {isLoading ? <PammysLoading height={5} width={5} /> : 'Refresh Discounts'}
            </button> */}
            <QueryStringReader />
            {/* <Link to="/dashboard/products/stock-update-logs">
              <button className="btn btn-secondary">Stock Logs</button>
            </Link> */}
            <PermissionCheck>
              <SyncShopifyProductForm />
            </PermissionCheck>
            <DropdownMenu>
              <DownloadCSVButton
                text={'Download Commited'}
                endpoint={'/product/get-product-varinats-supply-csv'}
                fileName={'CommitedProducts'}
                disabled={rows?.length === 0}
              />
              <DownloadCSVButton
                text={'Download CSV'}
                endpoint={'/product/get-product-varinats-csv'}
                fileName={'Products'}
                disabled={rows?.length === 0}
              />
            </DropdownMenu>
            {/* <PermissionCheck>
              <button
                disabled={loading}
                onClick={fetchProductsFromStore}
                className="btn btn-primary mr-4 cursor-pointer"
              >
                {loading ? 'Laden...' : 'Synchronisieren/Abrufen von Produkten aus Shopify'}
              </button>
            </PermissionCheck> */}
          </div>
        </div>
      </PermissionCheck>
      <TableContainer className="bg-white ">
        <Table sx={{ minWidth: 650 }} aria-label="collapsible table ">
          <TableHead>
            <TableRow>
              {productColumns?.map((column) => (
                <TableCell
                  sx={{
                    padding: '0px',

                    maxWidth: column.width ?? '150px',
                  }}
                  key={column.field}
                  className="border"
                >
                  <div className=" flex  flex-col gap-2  ">
                    <div className="flex  items-center justify-between px-2 pt-1 ">
                      <span
                        style={{
                          width: `${column.width}`,
                          margin: '0px',
                        }}
                        className="text-xs  text-black"
                      >
                        {column.headerName}
                      </span>
                      {column.sort === true ? (
                        <SortButtons
                          filters={filtersV2}
                          updateFilters={updateFiltersV2}
                          column={column}
                        />
                      ) : null}
                    </div>
                    {/* {column.field != 'expand_action' &&
                      column.field != 'actions' &&
                      column.field != 'unlimited_check' && (
                        <input
                          type="text"
                          placeholder={`Filter ${column.headerName}`}
                          value={columnFilters[column.field] || ''}
                          onChange={(e) => handleFilterChange(column, e.target.value)}
                          className="w-[80%] rounded-lg border border-gray-300 pl-2 "
                        />
                      )} */}
                    <div>
                      {column.search === true ? (
                        <div className="relative max-w-full border-t-2  text-gray-500 ">
                          <input
                            type="text"
                            placeholder={`Search field`}
                            value={filtersV2[column.field] || ''}
                            onChange={(e) =>
                              updateFiltersV2({ [column.field]: e.target.value, page: 1 })
                            }
                            className=" w-full py-1 pl-2 pr-7  font-light  "
                          />
                          {/* {filtersV2[column.field] !== '' ? ( */}
                          <div className="absolute bottom-0 right-2 top-0 flex items-center ">
                            <IconX
                              size={14}
                              className="cursor-pointer"
                              onClick={() => updateFiltersV2({ [column.field]: '', page: 1 })}
                            />
                          </div>
                          {/* ) : null} */}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {loadingTable ? (
            <LoadingTablePlaceholder perPage={filtersV2?.perPage || 10} colspan={columns?.length} />
          ) : rows?.products?.data?.length == 0 ? (
            <TableRow className="">
              <TableCell colSpan={columns.length}>
                <div className="flex h-16 items-center justify-center">
                  <Typography variant="body2" align="center" padding={2}>
                    Keine Daten verfügbar
                  </Typography>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              <TableBody className="border">
                {rows?.products?.data?.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      {/* <TableCell
                        sx={{
                          padding: '0',
                          padding: '0',
                          width: '20px',
                        }}
                      >
                        <div className="flex justify-center">
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => toggleRow(row.id)}
                          >
                            {openRows.includes(row.id) ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </div>
                      </TableCell> */}

                      <TableCell
                        sx={{
                          padding: '0',
                        }}
                        align="left"
                      >
                        <div className="flex items-center px-2">
                          <div className="flex justify-center">
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => toggleRow(row.id)}
                            >
                              {openRows.includes(row.id) ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </div>
                          <CopyToClipboard
                            text={row.barcode_number}
                            onCopy={() => handleCopy(row.barcode_number)}
                          >
                            <Tooltip
                              title={copied ? 'Copied!' : 'Copy to Clipboard'}
                              placement="top"
                            >
                              <span className="block max-w-[200px] cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap">
                                {row.barcode_number}
                              </span>
                            </Tooltip>
                          </CopyToClipboard>
                        </div>
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '0',
                        }}
                        align="left"
                      >
                        <div className="px-2">
                          <CopyToClipboard text={row.sku} onCopy={() => handleCopy(row.sku)}>
                            <Tooltip
                              title={copied ? 'Copied!' : 'Copy to Clipboard'}
                              placement="top"
                            >
                              <span className="block max-w-[200px] cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap">
                                {row.sku}
                              </span>
                            </Tooltip>
                          </CopyToClipboard>
                        </div>
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '0',
                        }}
                        align="left"
                      >
                        <div className="px-2">{row.product_title}</div>
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '0',
                        }}
                        align="left"
                      >
                        <div className="px-2">{row?.reserved_stock ? row?.reserved_stock : 0}</div>
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '0',
                        }}
                        align="left"
                      >
                        <div className="px-2">{row?.physical_stock ? row?.physical_stock : 0}</div>
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        <div className="px-2">{row?.picklist_stock}</div>
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        <div className="px-2">{row?.reserved_picklist_stock}</div>
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      ></TableCell>

                      <TableCell
                        sx={{
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                        align="left"
                      >
                        <PermissionCheck
                          roles={[RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.WAREHOUSE_EMPLOYEE]}
                        >
                          <span
                            className="cursor-pointer p-1"
                            onClick={() => handleEditProduct(row)}
                          >
                            <EditOrderIcon />
                          </span>
                        </PermissionCheck>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                        <Collapse in={openRows.includes(row.id)} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1, paddingTop: 1, paddingBottom: 1 }}>
                            <Typography variant="p" gutterBottom component="p" fontWeight="bold">
                              Lagerhaus
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Produkt</StyledTableCell>
                                  <StyledTableCell>Menge</StyledTableCell>
                                  <StyledTableCell>Regal</StyledTableCell>
                                  <StyledTableCell>Gewicht</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableCell>{row?.title}</TableCell>
                                <TableCell>
                                  <PermissionCheck
                                    roles={[
                                      RoleEnum.ADMIN,
                                      RoleEnum.SUPPORT,
                                      RoleEnum.WAREHOUSE_EMPLOYEE,
                                    ]}
                                  >
                                    <span
                                      className="inline-flex w-3 cursor-pointer  items-center justify-center"
                                      onClick={() =>
                                        handleQuantityChange(row?.shopify_variant_id, 'minus')
                                      }
                                    >
                                      -
                                    </span>
                                  </PermissionCheck>
                                  {row?.physical_stock ? row?.physical_stock : 0}
                                  <PermissionCheck
                                    roles={[
                                      RoleEnum.ADMIN,
                                      RoleEnum.SUPPORT,
                                      RoleEnum.WAREHOUSE_EMPLOYEE,
                                    ]}
                                  >
                                    <span
                                      className="inline-flex w-4 cursor-pointer  items-center justify-center"
                                      onClick={() =>
                                        handleQuantityChange(row?.shopify_variant_id, 'plus')
                                      }
                                    >
                                      +
                                    </span>
                                  </PermissionCheck>
                                </TableCell>
                                <TableCell>
                                  <input
                                    className="input h-[26px] border-gray-300 pl-2"
                                    type="text"
                                    value={
                                      storageLocations[row.id] === undefined
                                        ? formatStorageLocation(row?.storage_location)
                                        : storageLocations[row.id]
                                    }
                                    onChange={(event) =>
                                      handleInputChange(row?.shopify_variant_id, row.id, event)
                                    }
                                    onKeyDown={(event) => {
                                      if (event.key === 'Enter') {
                                        handleInputChange(row?.shopify_variant_id, row.id, event);
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="relative w-fit">
                                    <input
                                      className="input h-[26px] border-gray-300 pl-2"
                                      type="text"
                                      value={
                                        weightLocations[row.id] === undefined
                                          ? row?.weight
                                          : weightLocations[row.id]
                                      }
                                      onChange={(event) =>
                                        handleWeightInputChange(
                                          row?.shopify_variant_id,
                                          row.id,
                                          event,
                                          row,
                                        )
                                      } // Pass row.id to the handleInputChange function
                                      onKeyPress={(event) =>
                                        handleWeightInputChange(
                                          row?.shopify_variant_id,
                                          row.id,
                                          event,
                                          row,
                                        )
                                      }
                                    />
                                    <span className="absolute right-2 top-[1px]">
                                      {row?.weight_unit}
                                    </span>
                                  </div>
                                </TableCell>
                              </TableBody>
                            </Table>
                            <div className="mt-4 flex items-center  gap-4">
                              <div className="flex items-center gap-2">
                                {/* <Typography variant="p" component="p">
                                  Lagerbestand:{row?.physical_stock ? row?.physical_stock : 0} |
                                </Typography>
                                <div className="flex items-center gap-3">
                                  Offene Aufträge:
                                  <input
                                    type="number"
                                    className="input w-28"
                                    value={
                                      reservedStockValues[row.id] !== undefined
                                        ? reservedStockValues[row.id]
                                        : row?.reserved_stock || 0
                                    }
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedValues = {
                                        ...reservedStockValues,
                                        [row.id]: newValue,
                                      };
                                      setReservedStockValues(updatedValues);
                                    }}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleReservedStockUpdate(row, reservedStockValues[row.id]);
                                      }
                                    }}
                                  />
                                </div>{' '}
                                | */}
                                <Typography variant="p" component="p">
                                  Shopify Menge:
                                  <span className="font-bold"> {row?.shopify_quantity}</span>
                                </Typography>
                              </div>
                              <Link
                                className="btn btn-secondary ml-auto cursor-pointer"
                                to={`/dashboard/products/stock-update-logs?sku=${encodeURIComponent(row?.sku)}`}
                                state={{ queryString: queryStringUseQuery }}
                              >
                                Check Stock Logs
                              </Link>
                            </div>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>
      <QuantityProductsModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        calculationState={calculationState}
        setIsCheckboxError={setIsCheckboxError}
        reset={reset}
        quantityToUpdate={quantityToUpdate}
        setQuantityToUpdate={setQuantityToUpdate}
        control={control}
        validateCheckboxes={validateCheckboxes}
        isCheckboxError={isCheckboxError}
        saving={saving}
        handleModalSave={handleModalSave}
      />

      <EditProductModal
        open={isModalOpen2}
        handleClose={handleCloseModal2}
        fetchProducts={fetchProducts}
        productId={productId}
      />
      {/* <div className="flex items-center justify-center">
        <div className=" mr-auto flex items-center">
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={rows?.products.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Reihen pro Seite:"
          />
        </div>
      </div> */}
      {/* <CustomPaginationXentral
        page={page}
        pageSize={rowsPerPage}
        total={rows?.products?.total || 0}
        handlePageChange={handleChangePage}
        handlePageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      /> */}
      <Stack className="bg-button" spacing={2} sx={{ width: '100%' }}>
        <Snackbar
          sx={{
            '& .MuiPaper-root': {
              color: '#fff',
              backgroundColor: 'rgb(74, 222, 128)',
              padding: '20px',
            },
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={state.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert severity={'success'}>
            <div className="flex gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                color="#ffffff"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-rosette-discount-check"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
                <path d="M9 12l2 2l4 -4" />
              </svg>
              <div>
                <p className={`relative top-[-6px] text-lg text-white`}>Erfolgreich!</p>
                {state?.message && <h2 className={`text-sm text-white `}>{state?.message}</h2>}
              </div>
            </div>
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
};

export default ProductsTableV2UI;
