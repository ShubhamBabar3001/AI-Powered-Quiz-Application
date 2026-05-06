// hooks/useContests.js
import { useQuery } from "@tanstack/react-query";
import { fetchContest } from "../services/contestService";

export const useContests = () => {
  return useQuery({
    queryKey: ["contests"],
    queryFn: fetchContest,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};