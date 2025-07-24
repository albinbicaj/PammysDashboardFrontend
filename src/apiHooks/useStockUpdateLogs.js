import { useQuery } from '@tanstack/react-query';
import { getStockUpdateLogs } from '../api/stockUpdateLogs';

export const useStockUpdateLogs = (queryString = '') => {
  return useQuery({
    queryKey: ['getStockUpdateLogs', queryString],
    queryFn: () => getStockUpdateLogs(queryString),
  });
};
