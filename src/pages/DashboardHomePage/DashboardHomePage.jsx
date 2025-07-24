import React, { useState } from 'react';
import useDocumentTitle from '../../components/useDocumentTitle';
import { HomePageTabContent } from '../../components/molecules';
import ReturnsStats from './components/ReturnsStats';
import dayjs from 'dayjs';
import ReturnFilters from './components/ReturnFilters';
import { useSearchParams } from 'react-router-dom';
import { useHomeAnalytics } from '../../apiHooks/useOrders';

const dateRanges = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'Last 12 Months', days: 365 },
];

const SelectDateRange = ({ tempFilters = {}, updateFilters = () => {} }) => {
  const setDateRange = (days) => {
    const endDate = dayjs().endOf('day');
    const startDate = dayjs().subtract(days, 'day').startOf('day');

    updateFilters({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    });
  };

  const handleDateChange = (e, field) => {
    const newValue = e.target.value;
    updateFilters({ [field]: newValue });
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div>From:</div>
          <div>
            <input
              type="date"
              max={tempFilters.endDate || ''}
              className="rounded border p-2"
              value={tempFilters.startDate}
              onChange={(e) => handleDateChange(e, 'startDate')}
            />
          </div>
          <div>to:</div>
          <div>
            <input
              type="date"
              min={tempFilters.startDate || ''}
              value={tempFilters.endDate}
              onChange={(e) => handleDateChange(e, 'endDate')}
              className="rounded border p-2"
            />
          </div>
        </div>
      </div>
      <div className="h-12 border-r-4"></div>
      <div className="flex flex-row gap-2 align-top">
        {dateRanges.map((range) => (
          <button
            key={range.label}
            className="btn btn-secondary px-2 py-1.5"
            onClick={() => setDateRange(range.days)}
          >
            {range.label}
          </button>
        ))}
      </div>
    </>
  );
};

const DashboardHomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    filterOn: false,
    filterDate: false,
    sortBy: 'asc',
    sortWith: '',
    paymentMethod: [],
    startDate: searchParams.get('startDate') || dayjs().format('YYYY-MM-DD'),
    endDate: searchParams.get('endDate') || dayjs().format('YYYY-MM-DD'),
    typeId: searchParams.get('typeId') || '',
    reasonId: searchParams.get('reasonId') || '',
    searchQuery: searchParams.get('searchQuery') || '',
    filterType: 'all',
  });

  const updateUrlParams = (newFilters) => {
    const updatedParams = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });

    setSearchParams(updatedParams);
  };

  const handleFilterUpdate = (newFilter) => {
    const updatedFilters = { ...filters, ...newFilter };
    setFilters(updatedFilters);
    updateUrlParams(updatedFilters);
    const { search, ...restFilters } = newFilter;
    updateUrlParams(restFilters);
  };

  const { data, isLoading } = useHomeAnalytics(filters);

  useDocumentTitle("Pammy's | Home Analytics");

  return (
    <div className="homepage-container">
      <div className="mb-2 flex flex-col gap-4">
        <div className="mb-2 flex flex-col">
          <div className="flex flex-wrap items-center gap-5 border bg-[#fff] p-4">
            <SelectDateRange tempFilters={filters} updateFilters={handleFilterUpdate} />
          </div>
          <ReturnFilters updateFilters={handleFilterUpdate} filters={filters} />
        </div>
        <ReturnsStats data={data} loading={isLoading} />
        <HomePageTabContent
          variants={data?.variants}
          returnReasons={data?.reasons}
          loading={isLoading}
          soldItems={data?.sold_items}
        />
      </div>
    </div>
  );
};

export default DashboardHomePage;
