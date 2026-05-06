import { API } from "./createRequest";
import toast from 'react-hot-toast';
import { useQuizStore, useTestStore } from "../store/useStore";

export const fetchQuizzesByCategory = async (type) => {
  if (!type) return []; // safeguard
  const response = await API.get(`/quizzes/category/${type}`);
  if(type==='technical'){
    useQuizStore.getState().setTechQuiz(response.data);
  }else{
    useQuizStore.getState().setVerbalQuiz(response.data);
  }
  if(response.status!==200){
    toast.error("Failed to fetch quizzes");
    return [];
  } 
  return response.data === null ?[]:response.data; // returns the array of quizzes
};
export const featchQuizQuestions = async(quizId)=>{
  if (!quizId) return []; // safeguard

  const { aiTest } = useTestStore.getState();
   const url = aiTest
      ? `/ai/quizzes/start`
      : `/quizzes/start`;

  const response = await API.post(url, {},{
    params: { quizId }
  });
  if(response.status!==200){
    toast.error("Failed to fetch quizzes");
    return [];
  } 
  return response.data === null ?[]:response.data;
};
export const submitQuiz = async (quizId, answers,timeLeft) => {
  try {
    if (!quizId) return null;
     const { aiTest } = useTestStore.getState();
    const url = aiTest
      ? `/ai/quizzes/submit`
      : `/quizzes/submit`;
    const response = await API.post(url,answers,
      {params: { quizId,timeLeft }}
    );

    if (response.status !== 200) {
      toast.error("Failed to submit quiz");
      return null;
    }
    toast.success("Quiz submitted successfully");
    // console.log(response.data);
    useTestStore.getState().setAiTest(false);
    return response.data;
  } catch (error) {
    console.error("Submit Quiz Error:", error);
    toast.error("Error submitting quiz");
    return null;
  }
};