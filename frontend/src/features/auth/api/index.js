import API from "@/api/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const loginApi = async (payload) => {
  const { data } = await API.post(API_ENDPOINTS.AUTH_LOGIN, payload);
  return data;
};

export const signupApi = async (payload) => {
  const { data } = await API.post(API_ENDPOINTS.AUTH_SIGNUP, payload);
  return data;
};

export const forgotPasswordApi = async (payload) => {
  const { data } = await API.post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, payload);
  return data;
};

export const resetPasswordApi = async (payload) => {
  const { data } = await API.post(API_ENDPOINTS.AUTH_RESET_PASSWORD, payload);
  return data;
};

export const socialLoginApi = async (payload) => {
  const { data } = await API.post(API_ENDPOINTS.AUTH_SOCIAL_LOGIN, payload);
  return data;
};
