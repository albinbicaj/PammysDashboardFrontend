import { useQuery } from '@tanstack/react-query';
import {
  fetchAllOrders,
  dashboardRefund,
  deletedRequestedOrder,
  getAnalyticsLog,
  fetchWrongItemsAnalytics,
  fetchOrder,
  fetchDispatchCenterData,
  fetchDispatchCenterOrderWithProblem,
  fetchAttendanceLogs,
  fetchHomeAnalytics,
  fetchDiscounts,
  fetchPickerData,
  getOrders,
  fetchProductsVariantData,
} from '../api/orders';

export const useAllOrders = (queryString = '') => {
  return useQuery({
    queryKey: ['fetchAllOrders', queryString],
    queryFn: () => fetchAllOrders(queryString),
  });
};
export const useOrders = (queryString = '') => {
  return useQuery({
    queryKey: ['useOrders', queryString],
    queryFn: () => getOrders(queryString),
  });
};

export const useOrder = (orderId) => {
  // const navigate = useNavigate();

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const data = await fetchOrder(orderId);

      if (data.message === 'Dieser Auftrag wird im Dispatch Center nicht gefunden') {
        // navigate('/dashboard/dispatch-center');
        return null; // Prevents setting non-existent data
      }

      return data;
    },
    // enabled: !!orderNumber, // Prevents execution if orderNumber is not available
  });
};

export const dashboardRefunds = (queryString = '') => {
  return useQuery({
    queryKey: ['refunds', queryString],
    queryFn: () => dashboardRefund(queryString),
  });
};

export const deletedRequestedOrders = (queryString = '') => {
  return useQuery({
    queryKey: ['deleted-requested-orders', queryString],
    queryFn: () => deletedRequestedOrder(queryString),
  });
};

export const getAnalyticsLogs = (searchTerm = '', startDate = '', endDate = '') => {
  return useQuery({
    queryKey: ['get-analytic-logs', searchTerm, startDate, endDate],
    queryFn: () => getAnalyticsLog(searchTerm, startDate, endDate),
  });
};

export const useWrongItemsAnalytics = (startDate, endDate) => {
  return useQuery({
    queryKey: ['wrong-items-analytics', startDate, endDate],
    queryFn: () => fetchWrongItemsAnalytics(startDate, endDate),
  });
};
export const useDispatchCenterData = (queryString = '') => {
  return useQuery({
    queryKey: ['dispatch-center', queryString],
    queryFn: () => fetchDispatchCenterData(queryString),
  });
};

export const useDispatchCenterDataOrderWithProblems = (queryString = '') => {
  return useQuery({
    queryKey: ['dispatch-center-orders-with-problem', queryString],
    queryFn: () => fetchDispatchCenterOrderWithProblem(queryString),
  });
};
export const useAttendanceLogs = (startDate = '', endDate = '') => {
  return useQuery({
    queryKey: ['attendance-logs', startDate, endDate],
    queryFn: () => fetchAttendanceLogs(startDate, endDate),
  });
};

export const useHomeAnalytics = (filters) => {
  return useQuery({
    queryKey: ['home-analytics', filters],
    queryFn: () => fetchHomeAnalytics(filters),
  });
};

export const useDiscounts = () => {
  return useQuery({
    queryKey: ['discounts'],
    queryFn: () => fetchDiscounts(),
    enabled: false,
  });
};

export const usePickerData = (query = '', activeTab, columnFilters, filters, page, rowsPerPage) => {
  return useQuery({
    queryKey: ['pickerData', query, activeTab, columnFilters, filters, page, rowsPerPage],
    queryFn: () => fetchPickerData(query, activeTab, columnFilters, filters, page, rowsPerPage),
  });
};

export const useProductsVariantData = () => {
  return useQuery({
    queryKey: ['products-variant-data'],
    queryFn: () => fetchProductsVariantData(),
  });
};
