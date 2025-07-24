import axiosInstance from '../utils/axios';

export const fetchWebhooks = async () => {
  const response = await axiosInstance.get(`/webhooks`);
  return response.data;
};

//Save Webhook
export const saveWebhook = async () => {
  const response = await axiosInstance.post('/save-webhooks');
  return response.data;
};
