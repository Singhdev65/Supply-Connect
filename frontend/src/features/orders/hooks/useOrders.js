import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { isFeatureEnabled } from "@/app/config/featureFlags";
import {
  placeOrder,
  fetchOrders as fetchOrdersThunk,
  clearCurrentOrder as clearCurrentOrderAction,
} from "@/features/orders/store/orderSlice";
import { clearCart } from "@/features/cart";

const useOrders = () => {
  const dispatch = useDispatch();
  const ordersEnabled = isFeatureEnabled("orders");

  const orders = useSelector((state) => state.order?.orders?.data || []);
  const loading = useSelector((state) => state.order?.loading || false);

  const fetchOrders = useCallback(() => {
    if (!ordersEnabled) return Promise.resolve();
    return dispatch(fetchOrdersThunk());
  }, [dispatch, ordersEnabled]);

  const checkout = useCallback(
    async (payload) => {
      if (!ordersEnabled) return Promise.resolve({ meta: {} });
      const res = await dispatch(placeOrder(payload));
      if (placeOrder.fulfilled.match(res)) {
        dispatch(clearCart());
      }
      return res;
    },
    [dispatch, ordersEnabled],
  );

  const clearCurrentOrder = useCallback(() => {
    if (!ordersEnabled) return;
    dispatch(clearCurrentOrderAction());
  }, [dispatch, ordersEnabled]);

  return {
    orders,
    loading: ordersEnabled ? loading : false,
    checkout,
    fetchOrders,
    clearCurrentOrder,
  };
};

export default useOrders;
