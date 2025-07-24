import dayjs from 'dayjs';

export const returnsFilter = {
  filterOn: false, // Boolean to toggle filters on/off
  filterDate: false, // Boolean for date filter status
  // startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'), // Default start date: 1 month ago
  // endDate: dayjs().format('YYYY-MM-DD'), // Default end date: today
  startDate: '', // Default start date: 1 month ago
  endDate: '', // Default end date: today
  sortBy: 'asc', // Default sorting direction
  sortWith: '', // Field to sort by
  paymentMethod: [], // Array for multiple payment methods
  searchTags: [],
  searchText: '', // General search text field
  page: 1, // Current page for pagination
  perPage: 10, // Items per page for pagination
  activeTab: 'requested',
  activeSubTab: 'all',
};

export const returnsGiftCardFilter = {
  ...returnsFilter,
  activeTab: 'approved',
  activeSubTab: 'all',
};

export const returnsDamagedFilter = {
  ...returnsFilter,
  sortBy: 'asc',
  sortWith: 'created_at',
  activeTab: 'requested',
  activeSubTab: '5',
};

export const refundsFilter = {
  ...returnsFilter,
  activeTab: 'all',
  sortBy: 'asc',
  sortWith: 'refund_created_at',
};

export const archivedFilter = {
  filterOn: false, // Boolean to toggle filters on/off
  filterDate: false,
  startDate: '', // Default start date: 1 month ago
  endDate: '', // Default end date: today
  sortBy: 'asc', // Default sorting direction
  sortWith: '', // Field to sort by
  searchText: '', // General search text field
  page: 1, // Current page for pagination
  perPage: 10,
};

export const rejectedFilter = {
  ...returnsFilter,
  // activeTab: 'requested',
  // activeSubTab: '5',
};
