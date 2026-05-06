import { API } from "./createRequest";
import { validateEmail } from "./validation";
import { useAuthStore, useQuizStore } from "../store/useStore";
import toast from 'react-hot-toast';


// -------------------- LOGIN FUNCTIONS -----------------
export const loginUser = async (user) => {
  if (!user.email || !user.password) {
    return toast.error("Email and Password are required");
  }
  const emailError = validateEmail(user.email);
  if (emailError) {
    return toast.error(emailError);
  }

  try {
    const response = await API.post("/auth/login", user);
    useAuthStore.getState().login(response?.data);
    // console.log(response.data);
    return response.status;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Login failed");
  }
};
export const signUp = async (name, email, password, confirmPassword) => {
  if (!name || !email || !password || !confirmPassword) {
    return toast.error("All fields are required");
  }
  if (password !== confirmPassword) {
    return toast.error("Password not match");
  }

  const emailError = validateEmail(email);
  if (emailError) {
    return toast.error(emailError);
  }

  try {
    const response = await API.post("/auth/signup", { name, email, password });
    useAuthStore.getState().login(response?.data);
    return response.status;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Login failed");
  }
};
export const verify = async () => {
  try {
    const response = await API.get("/auth/verify"); // Or your specific endpoint
    if (response.status === 200) {
      useAuthStore.getState().login(response.data);
      return true;
    }
  } catch (error) {
    // If verification fails, clear the store
    useAuthStore.getState().logout();
    return false;
  }
};
export const changePassword = async ({ currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    toast.error('Current password and new password are required');
    return { success: false };
  }
  try {
    const response = await API.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    if (response.status === 200) {
      toast.success(response.data?.message || 'Password changed successfully');
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to change password';
    toast.error(message);
    return { success: false };
  }
};
export const forgotPassword = async (email, otp, newPassword) => {
  const emailError = validateEmail(email);
  if (emailError) {
    return toast.error(emailError);
  }
  try{
     const response = await API.put('/auth/forgot-password', {
      email,
      otp,
      newPassword,
    });
     toast.success(response.data|| 'Password changed successfully');
    
  }catch(error) {
    const message = error.response?.data?.message || error.message || 'Failed to change password';
    toast.error(message);
    return { success: false };
  }
}

export const featchHistory = async () => {
  try {
    const response = await API.get('/attempts/history');
    // console.log(response.data);
    if (response.status === 200) {
      toast.success(response.data?.message || 'Featch the attempts');
      useQuizStore.getState().addAttempt(response.data);
      return response.data;
    }
    return [];
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to change password';
    toast.error(message);
    return [];
  }
}