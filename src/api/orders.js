import axiosInstance from '../utils/axios';
import dayjs from 'dayjs';

export const fetchAllOrders = async (queryString) => {
  const response = await axiosInstance.get(`/all-orders?${queryString}`);
  return response.data;
};
export const getOrders = async (queryString) => {
  const response = await axiosInstance.get(`/order/get-orders?${queryString}`);
  return response.data;
};

export const fetchOrder = async (orderId) => {
  const response = await axiosInstance.get('/dispatch-center/get-order', {
    params: { order_number: parseInt(orderId) },
  });
  return response.data;
};

export const dashboardRefund = async (queryString) => {
  const response = await axiosInstance.get(`/dashboard/refunds?${queryString}`);
  return response.data;
};

export const deletedRequestedOrder = async (queryString) => {
  const response = await axiosInstance.get(`/dashboard/deleted-requested-orders?${queryString}`);
  return response.data;
};

export const getAnalyticsLog = async (searchTerm = '', startDate = '', endDate = '') => {
  const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
  const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';

  let filtersQuery =
    `${searchTerm !== '' ? `search=${searchTerm}` : ''}` +
    `${formattedStartDate || formattedEndDate ? `&date=${formattedStartDate},${formattedEndDate}` : ''}`;

  const url = `/get-analytics-logs?${filtersQuery}`;

  const response = await axiosInstance.get(url);
  return response.data;
};

export const fetchWrongItemsAnalytics = async (startDate, endDate) => {
  const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
  const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';

  const params = new URLSearchParams();
  if (formattedStartDate && formattedEndDate) {
    params.append('startDate', formattedStartDate);
    params.append('endDate', formattedEndDate);
  }

  const url = `/home-anayltics/wrong-items-analytics?${params.toString()}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

export const fetchDispatchCenterData = async (queryString) => {
  const response = await axiosInstance.get(`/dispatch-center/list?${queryString}`);
  return response.data;
};

export const fetchDispatchCenterOrderWithProblem = async (queryString) => {
  const response = await axiosInstance.get(`/dispatch-center/orders-with-problem?${queryString}`);
  return response.data;
};
export const fetchAttendanceLogs = async (startDate = '', endDate = '') => {
  const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
  const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';

  const response = await axiosInstance.get('/attendance/index', {
    params: {
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    },
  });
  return response.data;
};

export const fetchHomeAnalytics = async (filters) => {
  const params = new URLSearchParams();

  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.typeId) params.append('type', filters.typeId);
  if (filters.reasonId) params.append('reason', filters.reasonId);

  if (filters.search && filters.search.length > 0) {
    const searchType = filters.filterType || 'all';
    filters.search.forEach((item, index) => {
      switch (searchType) {
        case 'product_title':
          params.append(`search[${index}]`, item.product_name);
          break;
        case 'product_id':
          params.append(`search[${index}]`, item.product_id);
          break;
        case 'barcode':
          params.append(`search[${index}]`, item.barcode);
          break;
        case 'sku':
          params.append(`search[${index}]`, item.sku);
          break;
        case 'variant_id':
          params.append(`search[${index}]`, item.variant_id);
          break;
        case 'variant_title':
          params.append(`search[${index}]`, item.variant_title);
          break;
        default:
          params.append(`search[${index}]`, item.product_name);
          break;
      }
    });
  }

  const response = await axiosInstance.get(`/home-anayltics/index?${params.toString()}`);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error('Failed to fetch data');
  }
};

export const fetchDiscounts = async () => {
  const response = await axiosInstance.get(`/discounts`);
  return response.data;
};

export const fetchPickerData = async (
  query = '',
  activeTab,
  columnFilters,
  filters,
  page,
  rowsPerPage,
) => {
  let filtersQuery = `${filters.sortWith !== '' ? `&sortBy=${filters.sortBy}&sortWith=${filters.sortWith}` : ''}`;
  if (activeTab === 'all_pickers') {
    query += query ? '&' : '?';
    query += 'all_pickers=1';
  } else {
    query += query ? '&' : '?';
    query += 'all_pickers=0';
  }

  const filterParams = new URLSearchParams(columnFilters).toString();
  const fullQuery = query + (filterParams ? `&${filterParams}` : '');

  const paginationQuery = `&page=${page + 1}&per_page=${rowsPerPage}`;

  const response = await axiosInstance.get(
    `/picklist/pickers-list${fullQuery}${filtersQuery}${paginationQuery}`,
  );
  return response.data;
};

export const fetchProductsVariantData = async () => {
  const response = await axiosInstance.get(`/product/variant-data`);
  return response.data;
};
