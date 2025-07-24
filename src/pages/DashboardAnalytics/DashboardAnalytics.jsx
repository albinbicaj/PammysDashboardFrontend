import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import Select from 'react-select';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { SearchIcon } from '../../components/atoms';
import { CustomDatePicker } from '../../components/molecules';
import axiosInstance from '../../utils/axios';
import dayjs from 'dayjs';
import { IoSearch } from 'react-icons/io5';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
import { getAnalyticsLogs } from '../../apiHooks/useOrders';
import WrongItemsAnalytics from './components/WrongItemsAnalytics';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const sumFirstNumbers = payload.reduce(
      (sum, entry) => sum + Number(entry.payload[entry.dataKey]),
      0,
    );
    const sumSecondNumbers = payload.reduce(
      (sum, entry) => sum + Number(entry.payload[`${entry.dataKey}_second`]),
      0,
    );
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          height: 'auto',
          zIndex: 1000,
        }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="label" style={{ fontSize: '18px', fontWeight: 'bold' }}>{`${label}`}</p>
          <div className="flex items-center gap-2 text-lg font-bold">
            {sumFirstNumbers}/{sumSecondNumbers}
          </div>
        </div>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.payload[entry.dataKey]}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const DashboardAnalytics = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 2000);
  const [filters, setFilters] = useState({
    filterDate: true,
    sort_by: 'asc',
    sort_with: '',
    paymentMethod: [],
  });
  const [activeFilters, setActiveFilters] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const {
    data: analyticsLogs,
    isLoading: analyticsLogsLoading,
    refetch,
  } = getAnalyticsLogs(debouncedSearchTerm, startDate, endDate);

  const handleRoleChange = (selectedOption) => {
    setRole(selectedOption ? selectedOption.value : '');
    if (selectedOption?.value === 'retoure') {
      refetch().then(() => {
        transformData(analyticsLogs);
      });
    } else {
      if (selectedOption?.value === 'picker') {
        fetchData(debouncedSearchTerm, 'picker');
      } else if (selectedOption?.value === 'packer') {
        fetchData(debouncedSearchTerm, 'packer');
      }
    }
  };

  const handleSearchChange = async (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    if (role === 'retoure') {
      await refetch();
      transformData(analyticsLogs);
    } else {
      if (selectedOption?.value === 'picker') {
        fetchData(debouncedSearchTerm, 'picker');
      } else if (selectedOption?.value === 'packer') {
        fetchData(debouncedSearchTerm, 'packer');
      }
    }
  };

  const fetchData = async (newSearchTerm, roleParam) => {
    setIsLoading(true);
    const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
    const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';

    const params = new URLSearchParams();
    if (filters.sort_with !== '') {
      params.append('sort_by', filters.sort_by);
      params.append('sort_with', filters.sort_with);
    }
    if (roleParam) {
      params.append('type', roleParam);
    }
    if (filters.filterDate) {
      params.append('date', `${formattedStartDate},${formattedEndDate}`);
    }
    if (newSearchTerm) {
      params.append('search', newSearchTerm);
    }

    const url = `/get-analytics?${params.toString()}`;

    try {
      const response = await axiosInstance.get(url);
      transformData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const transformData = (responseData) => {
    const chartTransformedData = responseData.data.map((item) => {
      const newItem = { ...item };
      Object.keys(newItem).forEach((key) => {
        if (key !== 'time') {
          const [first, second] = newItem[key].split(',').map(Number);
          newItem[key] = first;
          newItem[`${key}_second`] = second;
        }
      });
      return newItem;
    });
    setData(responseData);
    setChartData(chartTransformedData);
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

  const toggleActiveFilters = () => {
    setActiveFilters(!activeFilters);
  };

  useEffect(() => {
    if (role === 'picker') {
      fetchData(debouncedSearchTerm, 'picker');
    } else if (role === 'packer') {
      fetchData(debouncedSearchTerm, 'packer');
    } else if (role === 'retoure' && analyticsLogs?.data) {
      transformData(analyticsLogs);
    } else if (role !== 'retoure' && role !== 'picker' && role !== 'packer') {
      fetchData(debouncedSearchTerm);
    }
  }, [role, startDate, endDate, debouncedSearchTerm, analyticsLogs]);

  const sortedKeys = Object.keys(chartData[0] || {})
    .filter((key) => key !== 'time' && !key.endsWith('_second'))
    .sort((a, b) => {
      const sumA = chartData.reduce((sum, item) => sum + item[a], 0);
      const sumB = chartData.reduce((sum, item) => sum + item[b], 0);
      return sumB - sumA;
    });

  const getCellColor = (value, isHour, isPickerRole) => {
    if (isHour && !isPickerRole) {
      if (value < 50) return { textColor: '#e31a32', backgroundColor: 'rgba(227, 26, 50, 0.035)' };
      if (value >= 50 && value <= 59)
        return { textColor: '#ee903a', backgroundColor: 'rgba(238, 144, 58, 0.035)' };
      if (value >= 60)
        return { textColor: '#5cc26d', backgroundColor: 'rgba(92, 194, 109, 0.035)' };
    } else if (!isHour && !isPickerRole) {
      if (value < 392) return { textColor: '#e31a32', backgroundColor: 'rgba(227, 26, 50, 0.035)' };
      if (value >= 400 && value <= 472)
        return { textColor: '#ee903a', backgroundColor: 'rgba(238, 144, 58, 0.035)' };
      if (value >= 480)
        return { textColor: '#5cc26d', backgroundColor: 'rgba(92, 194, 109, 0.035)' };
    } else if (isHour && isPickerRole) {
      if (value < 99) return { textColor: '#e31a32', backgroundColor: 'rgba(227, 26, 50, 0.035)' };
      if (value >= 100 && value <= 119)
        return { textColor: '#ee903a', backgroundColor: 'rgba(238, 144, 58, 0.035)' };
      if (value >= 120)
        return { textColor: '#5cc26d', backgroundColor: 'rgba(92, 194, 109, 0.035)' };
    } else if (!isHour && isPickerRole) {
      if (value < 792) return { textColor: '#e31a32', backgroundColor: 'rgba(227, 26, 50, 0.035)' };
      if (value >= 800 && value <= 952)
        return { textColor: '#ee903a', backgroundColor: 'rgba(238, 144, 58, 0.035)' };
      if (value >= 960)
        return { textColor: '#5cc26d', backgroundColor: 'rgba(92, 194, 109, 0.035)' };
    }
    return { textColor: '', backgroundColor: '' };
  };

  return (
    <div className="xentral-container">
      <Tabs
        className="relative z-0 mb-8 mt-8 flex w-full items-center border-b border-t bg-white"
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        sx={{
          '& .MuiTabs-indicator': { backgroundColor: '#4b5563', zIndex: 1 },
          '& .Mui-selected': { color: '#4b5563 !important;', zIndex: 1 },
        }}
      >
        <Tab
          label="Analytics"
          sx={{
            textTransform: 'none',
          }}
        />
        <Tab
          label="Wrong Items Analytics"
          sx={{
            textTransform: 'none',
          }}
        />
      </Tabs>
      {activeTab === 0 && (
        <div>
          <div className="flex justify-start gap-28">
            <div className="flex">
              <Typography variant="p" component="p">
                Verpackt:
              </Typography>
              <Typography variant="p" component="p" fontWeight="bold">
                {data?.total_count?.replace(',', '/')}
              </Typography>
            </div>
          </div>
          <div className="mb-4 border bg-white p-4 pt-6">
            <LineChart
              width={1200}
              height={500}
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 1500 }} />
              <Legend />
              {sortedKeys.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </LineChart>
          </div>

          <div className="flex items-center gap-3 border bg-white p-4">
            <CustomDatePicker
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              filters={filters}
              updateFilters={updateFilters}
              isAnalyticsPage
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
                key={'role'}
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
                  { value: 'picker', label: 'Picker' },
                  { value: 'packer', label: 'Packer' },
                  { value: 'retoure', label: 'Retoure' },
                ]}
                onChange={handleRoleChange}
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
            </div>
          </form>
          <TableContainer component={Paper} className="my-8">
            {isLoading || analyticsLogsLoading ? (
              <div className="flex h-full items-center justify-center">
                <PammysLoading />
              </div>
            ) : (
              <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                <TableHead>
                  <TableRow sx={{ height: '60px' }}>
                    <TableCell
                      sx={{
                        paddingTop: '0px',
                        paddingBottom: '0px',
                        width: '150px',
                      }}
                      className="custom-header"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex w-[80%] items-center justify-start gap-4">
                          <span
                            style={{
                              width: '150px',
                              margin: '0px',
                            }}
                            className="text-xs12 font-bold text-black"
                          >
                            {filters.filterDate ? 'Date' : 'Hour'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    {Object.keys(data?.data[0] || {})
                      .filter((key) => key !== 'time' && !key.endsWith('_second'))
                      .map((key) => (
                        <TableCell
                          sx={{
                            paddingTop: '0px',
                            paddingBottom: '0px',
                            width: '150px',
                          }}
                          key={key}
                          className="custom-header"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex w-[80%] items-center justify-start gap-4">
                              <span
                                style={{
                                  width: '150px',
                                  margin: '0px',
                                }}
                                className="text-xs12 font-bold text-black"
                              >
                                {key} {`(${data?.totals[key]?.replace(',', '/')})`}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.data?.length == 0 ? (
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
                    data?.data?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell key="time">{row.time}</TableCell>
                        {Object.keys(row)
                          .filter((key) => key !== 'time')
                          .map((key) => {
                            const value = parseInt(row[key].split(',')[0], 10);
                            const isHour = row.time.includes(':');
                            const { textColor, backgroundColor } = getCellColor(
                              value,
                              isHour,
                              role === 'picker',
                            );
                            return (
                              <TableCell key={key}>
                                <div
                                  style={{
                                    color: textColor,
                                    backgroundColor: backgroundColor,
                                    border: `1px solid ${textColor}`,
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    padding: '8px 12px',
                                    width: 'fit-content',
                                  }}
                                >
                                  {row[key].replace(',', '/')}
                                </div>
                              </TableCell>
                            );
                          })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </div>
      )}
      {activeTab === 1 && (
        <WrongItemsAnalytics
          startDate={startDate}
          endDate={endDate}
          debouncedSearchTerm={debouncedSearchTerm}
        />
      )}
    </div>
  );
};

export default DashboardAnalytics;
