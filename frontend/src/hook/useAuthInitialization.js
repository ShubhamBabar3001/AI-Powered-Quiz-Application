import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/useStore';
import { verify } from '../services/authApi';

export const useAuthInitialization = () => {
  const { login, logout} = useAuthStore();
const query = useQuery({
    queryKey: ['auth-user'],
    queryFn: verify,
    staleTime: Infinity,
    retry: false,
    onSuccess: (data) => login(data),
    onError: () => logout(),
  });

  return query;
};