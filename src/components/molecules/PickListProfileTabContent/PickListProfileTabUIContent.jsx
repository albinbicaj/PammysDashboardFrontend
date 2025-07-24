import React from 'react';
import {
  Box,
  Checkbox,
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
  Tooltip,
  Typography,
  styled,
  tableCellClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import Select from 'react-select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { PickListProfileColumns } from '../../../context/PickListProfileColumns';
import { DownloadPdf } from '../../atoms';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';
import CustomPaginationXentral from '../CustomPagination/CustomPaginationXentral';

const PickListProfileTabUIContent = ({
  currentTab,
  selectValue,
  handleScroll,
  rules,
  onSelectChange,
  fetchRulesList,
  setShortestPath,
  shortestPath,
  selected,
  isDownloading,
  roleId,
  onCreateProfile,
  loadingTable,
  partiallyFulfilled,
  handleChange,
  fetchedPickedListProfile,
  selectedCount,
  handleSortBy,
  filters,
  columnFilters,
  handleFilterChange,
  loadingFullTable,
  isSelected,
  handleCheckboxChange,
  handleSelectAllClick,
  toggleRow,
  openRows,
  handleDownloadAll,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
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
    <div>
      <div
        className={`${currentTab != 'picklist' ? 'justify-end' : 'justify-between'} mt-8  flex items-center border bg-white p-4`}
      >
        <div className="flex items-center gap-5">
          {currentTab == 'picklist' && (
            <>
              <Select
                value={selectValue}
                onMenuScrollToBottom={handleScroll}
                isClearable
                isSearchable
                placeholder="Tippen Sie für die Suche..."
                options={rules}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id.toString()}
                onChange={onSelectChange}
                onMenuOpen={() => fetchRulesList()}
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: '390px',
                  }),
                  indicatorsContainer: (provided) => ({
                    ...provided,
                    height: '42px',
                  }),
                }}
              />
              <div className="flex items-center gap-2  border  pr-2 ps-4">
                Shortest Path
                <Checkbox
                  color="success"
                  onChange={() => setShortestPath(!shortestPath)}
                  checked={shortestPath}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Tooltip
            placement="top"
            title={selected.length <= 0 || isDownloading ? 'Auswahlliste wählen' : null}
          >
            <button
              onClick={() => handleDownloadAll(null)}
              className="btn btn-primary"
              disabled={selected.length <= 0 || isDownloading}
            >
              <Typography variant="span" component="span">
                {isDownloading ? 'Herunterladen...' : 'Alle herunterladen'}
              </Typography>
            </button>
          </Tooltip>
          {currentTab == 'picklist' && (
            <Tooltip placement="top" title={!roleId ? 'Select pick list' : null}>
              <button
                onClick={onCreateProfile}
                disabled={!roleId || !selectValue || loadingTable}
                className="btn btn-primary"
              >
                <Typography variant="span" component="span">
                  {partiallyFulfilled == 1
                    ? 'Teilweise erfüllt erstellen'
                    : partiallyFulfilled == 2
                      ? 'Verlaufsliste erstellen'
                      : 'Auswahlliste erstellen'}
                </Typography>
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      <Tabs
        className="relative z-0 mt-8  flex w-full items-center border-b border-t bg-white"
        value={currentTab}
        onChange={handleChange}
        sx={{
          '& .MuiTabs-indicator': { backgroundColor: '#4b5563', zIndex: 1 },
          '& .Mui-selected': { color: '#4b5563 !important;', zIndex: 1 },
        }}
      >
        <Tab
          label="Auswahlliste"
          value={'picklist'}
          sx={{
            textTransform: 'none',
          }}
        />
        <Tab
          label="Heruntergeladen"
          value={'downloaded'}
          sx={{
            textTransform: 'none',
          }}
        />
        <Tab
          label="Arbeiten"
          value={'working'}
          sx={{
            textTransform: 'none',
          }}
        />
        <Tab
          label="Fertige"
          value={'finished'}
          sx={{
            textTransform: 'none',
          }}
        />
      </Tabs>

      <div>
        <TableContainer component={Paper} className="mt-8">
          <Table sx={{ minWidth: 650 }} aria-label="collapsible table" checkboxSelection>
            <TableHead>
              <TableRow sx={{ height: '80px' }}>
                <TableCell sx={{ padding: '0px 16px', width: '100px' }}>
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < fetchedPickedListProfile?.data?.length
                    }
                    checked={
                      fetchedPickedListProfile?.data?.length > 0 &&
                      selected.length === fetchedPickedListProfile?.data?.length
                    }
                    onChange={(event) => handleSelectAllClick(event)}
                    inputProps={{
                      'aria-label': 'select all picklists',
                    }}
                  />
                  <Typography variant="p" gutterBottom component="p" sx={{ paddingLeft: '8px' }}>
                    {selectedCount} / {fetchedPickedListProfile?.data?.length}
                  </Typography>
                </TableCell>
                {PickListProfileColumns.map((column) => (
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
                            placeholder={column?.placeHolder}
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
                <TableRow className="">
                  <TableCell colSpan={12}>
                    <div
                      className={`${loadingFullTable && 'absolute bottom-0 left-0 right-0 top-0 z-[1] h-full bg-white bg-opacity-50'}  flex h-16 items-center justify-center`}
                    >
                      <PammysLoading />
                    </div>
                  </TableCell>
                </TableRow>
              ) : fetchedPickedListProfile?.data?.length == 0 ||
                fetchedPickedListProfile?.length <= 0 ? (
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
                  {fetchedPickedListProfile?.data?.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ paddingTop: '0', paddingBottom: '0' }}>
                          <Checkbox
                            color="primary"
                            checked={isSelected(row.id)}
                            onChange={(event) => handleCheckboxChange(event, row.id)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            paddingTop: '0',
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
                          {dayjs(row?.created_at).format('DD.MM.YYYY [um] HH:mm')}
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
                              onClick={() => handleDownloadAll(row.id)}
                              className="cursor-pointer p-1 "
                            >
                              <DownloadPdf />
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

        <CustomPaginationXentral
          page={page}
          pageSize={rowsPerPage}
          total={fetchedPickedListProfile?.total || 0}
          handlePageChange={handleChangePage}
          handlePageSizeChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </div>
    </div>
  );
};

export default PickListProfileTabUIContent;
