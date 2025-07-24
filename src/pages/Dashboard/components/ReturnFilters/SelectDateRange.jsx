import dayjs from 'dayjs';

const dateRanges = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'Last 12 Months', days: 365 },
];

const SelectDateRange = ({ tempFilters = {}, updateTempFilters = () => {} }) => {
  // Set date range for the filter
  const setDateRange = (days) => {
    const endDate = dayjs().endOf('day');
    const startDate = dayjs().subtract(days, 'day').startOf('day');

    updateTempFilters({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    });
  };

  return (
    <div className="">
      <p className="pb-4 font-semibold">Date:</p>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div>
            <label className="block pb-2 text-sm">Start Date:</label>
            <input
              type="date"
              max={tempFilters?.endDate || ''} // Set max to endDate if present
              className="rounded border p-2"
              value={tempFilters?.startDate}
              onChange={(e) => updateTempFilters({ startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block pb-2 text-sm">End Date:</label>
            <input
              type="date"
              min={tempFilters?.startDate || ''} // Set min to startDate if present
              value={tempFilters?.endDate}
              onChange={(e) => updateTempFilters({ endDate: e.target.value })}
              className="rounded border p-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="btn btn-secondary px-2 py-1.5 text-sm"
            onClick={() => updateTempFilters({ startDate: '', endDate: '' })}
          >
            Clear date
          </button>
          {dateRanges.map((range) => (
            <button
              key={range.label}
              className="btn btn-secondary px-2 py-1.5 text-sm"
              onClick={() => setDateRange(range.days)} // Call setDateRange with the number of days
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectDateRange;
