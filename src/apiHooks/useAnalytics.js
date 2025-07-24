import { useQuery } from '@tanstack/react-query';
import { getAnalytics, homeAnalytics } from '../api/analytics';

export const useHomeAnalytics = (queryString = '') => {
  return useQuery({
    queryKey: ['analytics', queryString],
    queryFn: () => homeAnalytics(queryString),
  });
};

export const useAnalytics = (queryString = '') => {
  return useQuery({
    queryKey: ['webhooks', queryString],
    queryFn: () => getAnalytics(queryString),
  });
};
