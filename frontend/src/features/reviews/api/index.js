import API from "@/api/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const fetchProductReviewsApi = async (productId) => {
  const { data } = await API.get(API_ENDPOINTS.REVIEWS_BY_PRODUCT(productId));
  return data;
};

export const upsertProductReviewApi = async (productId, payload) => {
  const { data } = await API.post(API_ENDPOINTS.REVIEWS_BY_PRODUCT(productId), payload);
  return data;
};

export const respondToReviewApi = async (reviewId, payload) => {
  const { data } = await API.patch(API_ENDPOINTS.REVIEW_VENDOR_RESPONSE(reviewId), payload);
  return data;
};
