import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { SearchIcon } from '../../components/atoms';
import { CustomDatePicker } from '../../components/molecules';
import { Layout } from '../../components/template';
import { AnalyticColumns } from '../../context/AnalyticColumns';
import axiosInstance from '../../utils/axios';
import dayjs from 'dayjs';
import { IoSearch } from 'react-icons/io5';

const DashboardAnalytics = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    filterDate: true,
    sort_by: 'asc',
    sort_with: '',
    paymentMethod: [],
  });
  const [activeFilters, setActiveFilters] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [role, setRole] = useState(''); // State to hold selected role

  const handleRoleChange = (selectedOption) => {
    if (selectedOption) {
      setRole(selectedOption.value);
    } else {
      setRole(null);
    }
  };

  const handleSearchChange = async (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm.trim() === '') {
      fetchData(event.target.value);
      return;
    }
    fetchData(newSearchTerm);
  };

  const fetchData = async (newSearchTerm) => {
    const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
    const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';
    let filtersQuery =
      `${filters.sort_with !== '' ? `&sort_by=${filters.sort_by}&sort_with=${filters.sort_with}` : ''}` +
      `${role ? `&role=${role}` : ''}` +
      `${filters.filterDate ? `&date=${formattedStartDate},${formattedEndDate}` : ''}` +
      `${newSearchTerm != '' ? `&search=${newSearchTerm}` : ''}`;

    let url = `/get-analytics?${filtersQuery}`;

    // if (role) {
    //   url += `role=${role ? role : ''}`;
    // }

    // if (filters.filterDate && formattedStartDate && formattedEndDate) {
    //   url += `&date=${formattedStartDate},${formattedEndDate}`;
    // }

    // if (newSearchTerm != '') {
    //   url += `&search=${newSearchTerm != '' ? newSearchTerm : ''}`;
    // }

    const response = await axiosInstance.get(url);
    setData(response?.data);
    setChartData(response?.data);
  };

  const updateFilters = (fieldsToUpdate) => {
    setFilters((prevContext) => {
      let updatedContext = { ...prevContext };
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        updatedContext[key] = value;
      }
      return updatedContext;
    });
  };

  const handleSortBy = (sort) => {
    if (filters.sort_by === sort.sort_by && filters.sort_with === sort.sort_with) {
      updateFilters({ sort_by: 'asc', sort_with: '' });
    } else {
      updateFilters(sort);
    }
  };

  const toggleActiveFilters = () => {
    setActiveFilters(!activeFilters);
  };

  useEffect(() => {
    fetchData(searchTerm);
  }, [role, startDate, endDate, filters]);

  return (
    <div className="xentral-container">
      <div className="flex justify-start gap-28">
        <div className="flex">
          <Typography variant="p" component="p">
            Gewählt:
          </Typography>
          <Typography variant="p" component="p" fontWeight="bold">
            {data?.picker_count}
          </Typography>
        </div>
        <div className="flex">
          <Typography variant="p" component="p">
            Verpackt:
          </Typography>
          <Typography variant="p" component="p" fontWeight="bold">
            {data?.packer_count}
          </Typography>
        </div>
      </div>
      <div className="mb-4 border bg-white p-4 pt-6">
        <LineChart
          width={1200}
          height={300}
          data={chartData?.users}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={(item) => {
              const userInitial = item?.user?.match(/[A-Z]/g)?.join('');
              return `${userInitial} - ${item?.role == 'Picker' ? 'PI' : 'PA'}`;
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />{' '}
          {/* Use 'count' property as Y-axis data */}
        </LineChart>
      </div>

      <div className="flex items-center gap-3 border bg-white p-4">
        <CustomDatePicker
          startDate={startDate}
          setStartDate={setStartDate} // Assuming you have a function to update the start date
          endDate={endDate}
          setEndDate={setEndDate} // Assuming you have a function to update the end date
          filters={filters}
          updateFilters={updateFilters}
        />
        <div
          className={'btn ' + (activeFilters ? 'btn-primary' : 'btn-secondary')}
          onClick={toggleActiveFilters}
        >
          {activeFilters ? 'Filter ausblenden' : 'Filter einblenden'}
        </div>
      </div>
      <form
        className={` mt-5 inline-flex gap-5 border bg-white px-4 py-5 ${
          activeFilters ? 'visible' : 'hidden'
        } `}
      >
        <div>
          <Select
            styles={{
              container: (provided) => ({
                ...provided,
                width: '250px',
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                height: '42px',
              }),
            }}
            isClearable
            isSearchable
            placeholder="Wählen Sie eine..."
            options={[
              { value: 'pick', label: 'Picker' },
              { value: 'pack', label: 'Packer' },
            ]}
            onChange={handleRoleChange} // Handle role select change
          />
        </div>
        <div className="input flex items-center pl-3">
          <div className="search-icon-wrapper">
            <IoSearch />
          </div>
          <input
            type="text"
            placeholder="Suche"
            className="orders-search-input border-none outline-none"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>{' '}
      </form>
      <TableContainer component={Paper} className="my-8">
        <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ height: '60px' }}>
              {AnalyticColumns?.map((column) => (
                <TableCell
                  sx={{
                    paddingTop: '0px',
                    paddingBottom: '0px',
                    width: `${column.widh}`,
                  }}
                  key={column.field}
                  className="custom-header"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex w-[80%] items-center justify-start gap-4">
                      <span
                        style={{
                          width: `${column.width}`,
                          margin: '0px',
                        }}
                        className="text-xs12 font-bold text-black"
                      >
                        {column.headerName}
                      </span>
                      {column.field !== 'expand_action' && column.field !== 'actions' && (
                        <div className="cursor-pointer">
                          <div
                            className={
                              filters.sort_by === 'desc' && filters.sort_with === column.field
                                ? 'rounded-md bg-accent text-black'
                                : ''
                            }
                            onClick={() =>
                              handleSortBy({
                                sort_by: 'desc',
                                sort_with: column.field,
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
                              filters.sort_by === 'asc' && filters.sort_with === column.field
                                ? 'rounded-md bg-accent text-black'
                                : ''
                            }
                            onClick={() =>
                              handleSortBy({
                                sort_by: 'asc',
                                sort_with: column.field,
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
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.users?.length == 0 ? (
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
              data?.users?.map((row, index) => (
                <TableRow key={index}>
                  {AnalyticColumns.map((column) => (
                    <TableCell key={column.field}>
                      {row[column.field] ? row[column.field] : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default DashboardAnalytics;
