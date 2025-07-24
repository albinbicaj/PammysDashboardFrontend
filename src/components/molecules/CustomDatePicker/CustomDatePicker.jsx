import React, { useState } from 'react';
import { DateRangePicker, defaultStaticRanges, defaultInputRanges } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { grey } from '@mui/material/colors';
import dayjs from 'dayjs';
import { Switch } from '@mui/material';
import { de } from 'date-fns/locale';

export const CustomDatePicker = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  filters,
  updateFilters,
  setDatePickerChange,
  useLegacyDatePicker = false,
  isAnalyticsPage = false,
}) => {
  const greyColor = grey[400];
  const [open, setOpen] = useState(false);

  const handleSelect = (date) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    updateFilters({
      filterDate: true,
      startDate: date.selection.startDate,
      endDate: date.selection.endDate,
    });
    if (setDatePickerChange) {
      setDatePickerChange(true);
    }
  };

  const formattedDateRange =
    startDate && endDate
      ? `${dayjs(startDate).format('DD.MM.YYYY')} - ${dayjs(endDate).format('DD.MM.YYYY')}`
      : 'Nach datum filtern';

  const englishToGermanLabels = {
    Today: 'Heute',
    Yesterday: 'Gestern',
    'This Week': 'Diese Woche',
    'Last Week': 'Letzte Woche',
    'This Month': 'Dieser Monat',
    'Last Month': 'Letzter Monat',
  };

  const dynamicStaticRanges = defaultStaticRanges.map((staticRange) => ({
    ...staticRange,
    label: englishToGermanLabels[staticRange.label] || staticRange.label,
  }));

  const englishToGermanInputs2 = {
    'days up to today': 'Tage bis zum heutigen Tag',
    'days starting today': 'Tage ab heute',
  };

  const dynamicInputRanges2 = defaultInputRanges.map((staticRange) => ({
    ...staticRange,
    label: englishToGermanInputs2[staticRange.label] || staticRange.label,
  }));

  const handleRangeClick = (days, event) => {
    event.preventDefault();
    const end = dayjs();
    const start = dayjs().subtract(days, 'day');
    setStartDate(start.toDate());
    setEndDate(end.toDate());
    updateFilters({ filterDate: true, startDate: start.toDate(), endDate: end.toDate() });
  };

  const handleDateChange = (type, value) => {
    const newDate = dayjs(value).toDate();
    if (type === 'startDate') {
      setStartDate(newDate);
    } else if (type === 'endDate') {
      setEndDate(newDate);
    }

    updateFilters({
      filterDate: true,
      startDate: startDate || newDate,
      endDate: endDate || newDate,
    });

    if (setDatePickerChange) {
      setDatePickerChange(true);
    }
  };

  const clearDate = (event) => {
    event.preventDefault();
    setStartDate(null);
    setEndDate(null);
    updateFilters({ filterDate: false, startDate: null, endDate: null });
    if (setDatePickerChange) {
      setDatePickerChange(true);
    }
  };

  return (
    <div>
      {useLegacyDatePicker ? (
        <div className="flex gap-4 py-4 pl-4">
          <div className="flex-col items-baseline">
            <div className="relative">
              <div className="cursor-pointer flex-col items-center">
                <div className="flex flex-col justify-start gap-2">
                  {[
                    { label: 'Today', days: 0 },
                    { label: 'Last 7 Days', days: 7 },
                    { label: 'Last 30 Days', days: 30 },
                    { label: 'Last 90 Days', days: 90 },
                    { label: 'Last 12 Months', days: 365 },
                  ].map((range) => (
                    <button
                      key={range.label}
                      className="btn btn-secondary px-2 py-1.5 text-sm"
                      onClick={(event) => handleRangeClick(range.days, event)}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-col gap-4">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm">Start Date:</label>
                <input
                  type="date"
                  max={endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''}
                  value={startDate ? dayjs(startDate).format('YYYY-MM-DD') : ''}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm">End Date:</label>
                <input
                  type="date"
                  min={startDate ? dayjs(startDate).format('YYYY-MM-DD') : ''}
                  value={endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                />
              </div>
            </div>
            <div className="mt-2">
              <button
                className="btn btn-secondary px-2 py-1 text-sm"
                onClick={(event) => clearDate(event)}
              >
                Clear date
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center  rounded-md border-2 px-1 ">
          {!isAnalyticsPage && (
            <Switch
              color="primary"
              checked={filters.filterDate}
              onChange={() => {
                updateFilters({ filterDate: !filters.filterDate });
                if (setDatePickerChange) {
                  setDatePickerChange(true);
                }
              }}
              inputProps={{ 'aria-label': 'Toggle switch' }}
            />
          )}
          <div className="relative">
            {open && (
              <div className="fixed inset-0  z-40 opacity-50" onClick={() => setOpen(false)}></div>
            )}
            {open && (
              <div className="absolute left-0 top-0 z-50 mt-8">
                <DateRangePicker
                  ranges={[{ startDate, endDate, key: 'selection' }]}
                  onChange={handleSelect}
                  locale={de}
                  startDatePlaceholder="Frühzeitig"
                  endDatePlaceholder="Kontinuierlich"
                  staticRanges={dynamicStaticRanges}
                  inputRanges={dynamicInputRanges2}
                />
              </div>
            )}
            <div onClick={() => setOpen(!open)} className="flex cursor-pointer items-center p-1">
              <span className="mr-4">{formattedDateRange || 'Nach datum filtern'} </span>
              <CalendarMonthIcon color={greyColor} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
