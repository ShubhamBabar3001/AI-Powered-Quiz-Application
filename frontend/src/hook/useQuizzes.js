// hooks/useQuizzes.js
import { useQuery } from '@tanstack/react-query';
import { fetchQuizzesByCategory,featchQuizQuestions } from '../services/quizService';

export const useQuizzes = (type) => {
  return useQuery({
    queryKey: ['quizzes', type],
    queryFn: () => fetchQuizzesByCategory(type),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
};
export const useQuestions = (quizId)=>{
  return useQuery({
    queryKey: ['questions', quizId],
    queryFn: () => featchQuizQuestions(quizId),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
};
