import API from "@/api/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const fetchBuyerProductsApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.PRODUCTS);
  return data;
};
