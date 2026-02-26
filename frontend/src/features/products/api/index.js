import API from "@/api/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const fetchProductsApi = async (params = {}) => {
  const { data } = await API.get(API_ENDPOINTS.PRODUCTS, { params });
  return data;
};

export const fetchProductByIdApi = async (productId) => {
  const { data } = await API.get(API_ENDPOINTS.PRODUCT_BY_ID(productId));
  return data;
};

export const createProductApi = async (payload) => {
  const { data } = await API.post(API_ENDPOINTS.PRODUCTS, payload);
  return data;
};

export const updateProductApi = async (productId, payload) => {
  const { data } = await API.put(API_ENDPOINTS.PRODUCT_BY_ID(productId), payload);
  return data;
};

export const deleteProductApi = async (productId) => {
  const { data } = await API.delete(API_ENDPOINTS.PRODUCT_BY_ID(productId));
  return data;
};
