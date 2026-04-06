import API from "@/api/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const fetchBuyerProductsApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.PRODUCTS);
  return data;
};

export const fetchWishlistApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.USERS_ME_WISHLIST);
  return data?.data || [];
};

export const addToWishlistApi = async (productId) => {
  const { data } = await API.post(API_ENDPOINTS.USERS_ME_WISHLIST_BY_ID(productId));
  return data?.data || [];
};

export const removeFromWishlistApi = async (productId) => {
  const { data } = await API.delete(API_ENDPOINTS.USERS_ME_WISHLIST_BY_ID(productId));
  return data?.data || [];
};

export const fetchRecentlyViewedApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.USERS_ME_RECENTLY_VIEWED);
  return data?.data || [];
};

export const markRecentlyViewedApi = async (productId) => {
  const { data } = await API.post(API_ENDPOINTS.USERS_ME_RECENTLY_VIEWED_BY_ID(productId));
  return data?.data || [];
};

export const fetchActiveDealsApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.PROMOTIONS_ACTIVE);
  return data?.data || [];
};

export const validateCouponApi = async ({ code, items }) => {
  const { data } = await API.post(API_ENDPOINTS.PROMOTIONS_VALIDATE, { code, items });
  return data?.data || null;
};
