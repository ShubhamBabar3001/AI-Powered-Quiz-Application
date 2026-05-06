import { API } from "./createRequest";
import toast from 'react-hot-toast';
import {useTestStore } from "../store/useStore";


export const genarateQuestions = async (topic, difficulty, count,timeLimit) => {
  const response = await API.post(`/ai/questions/generate`,{topic,difficulty,count,timeLimit});
//  console.log(response.data);
  useTestStore.getState().setAiTest(true);
  if(response.status!==200){
    toast.error("Failed to genarate question");
    return [];
  } 
  return response.data === null ?[]:response.data; // returns the array of quizzes
};