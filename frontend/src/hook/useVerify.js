// hooks/useVerify.js
import { useQuery } from "@tanstack/react-query";
import { verify } from "../services/authApi";

export const useVerify = () => {
  return useQuery({
    queryKey: ["verifyUser"],
    queryFn: verify,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });
};