import { useQuery } from '@tanstack/react-query';
import { featchHistory } from '../services/authApi';
export const useHistory = () => {
  return useQuery({
    queryKey: ['history'],
    queryFn: () => featchHistory(),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
};