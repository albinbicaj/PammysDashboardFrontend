import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';

export const useProducts = (queryString = '') => {
  return useQuery({ queryKey: ['products', queryString], queryFn: () => getProducts(queryString) });
};
