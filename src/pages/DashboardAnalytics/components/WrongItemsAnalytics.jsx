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
} from '@mui/material';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomDatePicker } from '../../../components/molecules';
import { useWrongItemsAnalytics } from '../../../apiHooks/useOrders';
import { PammysLoading } from '../../../components/atoms/PammysLoading/PammysLoading';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const sumFirstNumbers = payload.reduce(
      (sum, entry) => sum + Number(entry.payload[entry.dataKey]),
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
          <div className="flex items-center gap-2 text-lg font-bold">{sumFirstNumbers}</div>
        </div>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`Wrong items count: ${entry.payload[entry.dataKey]}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const WrongItemsAnalytics = ({ startDate, endDate }) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [filters, setFilters] = useState({
    filterDate: true,
    sort_by: 'asc',
    sort_with: '',
    paymentMethod: [],
  });

  const { data, isLoading } = useWrongItemsAnalytics(localStartDate, localEndDate);

  const transformData = (responseData) => {
    return responseData.wrong_items_by_user.map((item) => ({
      user_name: item.user_name,
      wrong_item_count: item.wrong_item_count,
    }));
  };

  const chartData = data ? transformData(data) : [];

  const getCellColor = (value) => {
    if (value < 50) return { textColor: '#5cc26d', backgroundColor: 'rgba(92, 194, 109, 0.035)' };
    if (value >= 50 && value <= 59)
      return { textColor: '#ee903a', backgroundColor: 'rgba(238, 144, 58, 0.035)' };
    if (value >= 60) return { textColor: '#e31a32', backgroundColor: 'rgba(227, 26, 50, 0.035)' };
    return { textColor: '', backgroundColor: '' };
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

  return (
    <div className="xentral-container">
      <div className="mb-4 border bg-white p-4 pt-6">
        <LineChart
          width={1200}
          height={500}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="user_name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 1500 }} />
          <Legend />
          <Line type="monotone" dataKey="wrong_item_count" stroke="#8884d8" />
        </LineChart>
      </div>
      <div className="flex items-center gap-3 border bg-white p-4">
        <CustomDatePicker
          startDate={localStartDate}
          setStartDate={setLocalStartDate}
          endDate={localEndDate}
          setEndDate={setLocalEndDate}
          updateFilters={updateFilters}
          isAnalyticsPage
        />
      </div>
      <TableContainer component={Paper} className="my-8">
        {isLoading ? (
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
                        User
                      </span>
                    </div>
                  </div>
                </TableCell>
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
                        Wrong Item Count
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chartData.length === 0 ? (
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
                chartData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.user_name}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          color: getCellColor(row.wrong_item_count).textColor,
                          backgroundColor: getCellColor(row.wrong_item_count).backgroundColor,
                          border: `1px solid ${getCellColor(row.wrong_item_count).textColor}`,
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          fontSize: '15px',
                          padding: '8px 12px',
                          width: 'fit-content',
                        }}
                      >
                        {row.wrong_item_count}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
};

export default WrongItemsAnalytics;
