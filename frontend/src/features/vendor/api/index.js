import API from "@/api/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const fetchVendorProductsApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.PRODUCTS);
  return data;
};

export const createVendorProductApi = async (payload) => {
  const { data } = await API.post(API_ENDPOINTS.PRODUCTS, payload);
  return data;
};

export const updateVendorProductApi = async (productId, payload) => {
  const { data } = await API.put(API_ENDPOINTS.PRODUCT_BY_ID(productId), payload);
  return data;
};

export const deleteVendorProductApi = async (productId) => {
  const { data } = await API.delete(API_ENDPOINTS.PRODUCT_BY_ID(productId));
  return data;
};

export const fetchVendorOrdersApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.ORDERS);
  return data;
};

export const updateVendorOrderStatusApi = async (orderId, status) => {
  const { data } = await API.patch(API_ENDPOINTS.ORDER_STATUS_BY_ID(orderId), { status });
  return data;
};

export const fetchVendorSalesReportApi = async (days = 30) => {
  const { data } = await API.get(API_ENDPOINTS.ORDERS_VENDOR_REPORT, {
    params: { days },
  });
  return data;
};
