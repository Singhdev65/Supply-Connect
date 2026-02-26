import API from "@/api/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const placeOrder = async ({ items, addressId, deliveryNotes = "" }) => {
  const { data } = await API.post(API_ENDPOINTS.ORDERS, {
    addressId,
    deliveryNotes,
    items: (items || []).map((item) => ({
      product: item._id,
      qty: item.qty,
    })),
  });

  return data.data;
};
