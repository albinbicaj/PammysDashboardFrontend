import axiosInstance from '../utils/axios';

export const getStockUpdateLogs = async (queryString) => {
  const response = await axiosInstance.get(`/product/stock-update-logs?${queryString}`);
  return response.data;
};
