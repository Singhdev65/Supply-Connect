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

export const fetchVendorPromotionsApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.PROMOTIONS_MINE);
  return data;
};

export const createVendorPromotionApi = async (payload) => {
  const { data } = await API.post(API_ENDPOINTS.PROMOTIONS, payload);
  return data;
};

export const updateVendorPromotionApi = async (promotionId, payload) => {
  const { data } = await API.put(API_ENDPOINTS.PROMOTION_BY_ID(promotionId), payload);
  return data;
};

export const toggleVendorPromotionApi = async (promotionId) => {
  const { data } = await API.patch(API_ENDPOINTS.PROMOTION_TOGGLE_BY_ID(promotionId));
  return data;
};

export const archiveVendorPromotionApi = async (promotionId) => {
  const { data } = await API.delete(API_ENDPOINTS.PROMOTION_BY_ID(promotionId));
  return data;
};

export const fetchFinanceSummaryApi = async (days = 30) => {
  const { data } = await API.get(API_ENDPOINTS.FINANCE_SUMMARY, { params: { days } });
  return data;
};

export const fetchFinanceTransactionsApi = async (params = {}) => {
  const { data } = await API.get(API_ENDPOINTS.FINANCE_TRANSACTIONS, { params });
  return data;
};

export const fetchFinancePayoutsApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.FINANCE_PAYOUTS);
  return data;
};

export const requestFinancePayoutApi = async (payload) => {
  const { data } = await API.post(API_ENDPOINTS.FINANCE_PAYOUT_REQUEST, payload);
  return data;
};

export const fetchFinanceTaxReportApi = async (days = 90) => {
  const { data } = await API.get(API_ENDPOINTS.FINANCE_TAX_REPORT, { params: { days } });
  return data;
};
