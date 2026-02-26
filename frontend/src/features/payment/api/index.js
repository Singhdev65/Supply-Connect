import API from "@/api/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const createPaymentOrder = async (orderId, method) => {
  const { data } = await API.post(API_ENDPOINTS.PAYMENTS_CREATE, {
    orderId,
    method,
  });

  return data.data;
};

// -------------------------
// Verify Razorpay
// -------------------------
export const verifyRazorpayPayment = async (payload) => {
  const { data } = await API.post(API_ENDPOINTS.PAYMENTS_VERIFY_RAZORPAY, payload);
  return data.data;
};

// -------------------------
// Generate UPI QR
// -------------------------
export const generateUPIQR = async (orderId) => {
  const { data } = await API.post(API_ENDPOINTS.PAYMENTS_UPI_GENERATE, {
    orderId,
  });

  return data.data;
};

// -------------------------
// Check Payment Status
// -------------------------
export const checkPaymentStatus = async (orderId) => {
  const { data } = await API.get(API_ENDPOINTS.PAYMENTS_STATUS(orderId));
  return data.data;
};

// -------------------------
// COD Confirm
// -------------------------
export const confirmCOD = async (orderId) => {
  const { data } = await API.post(API_ENDPOINTS.PAYMENTS_COD, { orderId });
  return data.data;
};
