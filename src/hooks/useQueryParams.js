import { useLocation, useSearchParams } from 'react-router-dom';

export const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  return new URLSearchParams(searchParams);
};
