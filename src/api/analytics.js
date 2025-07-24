import axiosInstance from '../utils/axios';

export const homeAnalytics = async (queryString) => {
  const response = await axiosInstance.get(`/home-anayltics/index?${queryString}`);
  return response.data;
};

export const getAnalytics = async (queryString = '') => {
  const response = await axiosInstance.get(`/get-analytics?${queryString}`);
  return response.data;
};
