import { useQuery } from '@tanstack/react-query';
import { fetchWebhooks } from '../api/webhooks';

export const useWebhooks = () => {
  return useQuery({ queryKey: ['webhooks'], queryFn: () => fetchWebhooks() });
};
