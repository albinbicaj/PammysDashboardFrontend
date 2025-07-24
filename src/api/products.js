import axiosInstance from '../utils/axios';

export const getProducts = async (queryString = '') => {
  const response = await axiosInstance.get(`/product/all?${queryString}`);
  return response.data;
};
