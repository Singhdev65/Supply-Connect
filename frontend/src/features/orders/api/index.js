import API from "@/api/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const placeOrderApi = async (payload) => {
  const normalized = Array.isArray(payload) ? { items: payload } : payload || {};
  const items = normalized.items || [];
  const { data } = await API.post(API_ENDPOINTS.ORDERS, {
    addressId: normalized.addressId,
    deliveryNotes: normalized.deliveryNotes || "",
    items: items.map((item) => ({
      product: item._id,
      qty: item.qty,
    })),
  });

  return data;
};

export const fetchOrdersApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.ORDERS);
  return data;
};
