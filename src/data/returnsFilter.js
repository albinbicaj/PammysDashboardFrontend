import dayjs from 'dayjs';

export const returnsFilter = {
  filterOn: false, // Boolean to toggle filters on/off
  filterDate: false, // Boolean for date filter status
  startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'), // Start date: today - 1 month
  endDate: dayjs().format('YYYY-MM-DD'), // End date: today
  sortBy: 'asc', // String for sorting direction
  sortWith: '', // String for sorting field
  paymentMethod: [], // Array for multiple payment methods
  searchText: '', // String for general text-based search
};
