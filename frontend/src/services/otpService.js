import { API } from "./createRequest";
import toast from 'react-hot-toast';

export const sendOtp = async (email,purpose) => {
  const response = await API.post(`/otp/send`, { email, purpose });
// returns the array of quizzes
  if(response.status===200){
    toast.success(response.data.message);
  }else{
     toast.error(response.data.message);
  }
};

export const verifyOtp = async (email,otp) => {
  const response = await API.post(`/otp/verify`, { email,otp });
  return response;
};