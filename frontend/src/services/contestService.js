import { API } from "./createRequest";
import toast from 'react-hot-toast';

export const fetchContest = async () => {
  const response = await API.get(`/contests`);
   console.log(response.data);

  if (response.status !== 200) {
    toast.error("Failed to fetch quizzes");
    return [];
  }
  return response.data === null ? [] : response.data; // returns the array of quizzes
};
export const endrollInContest = async (contestId) => {
  const response = await API.post(`/contests/enroll/${contestId}`);

  if (response.status !== 200) {
    toast.error("Not endroll in the contest Re-try again");
    return [];
  }
   toast.success("Succesfully endroll in the contest");
  return response.data === null ? [] : response.data;
}