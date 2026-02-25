import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  placeOrder,
  fetchOrders as fetchOrdersThunk,
  clearCurrentOrder as clearCurrentOrderAction,
} from "../store/orderSlice";
import { clearCart } from "../store/cartSlice";

const useOrders = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.order?.orders?.data || []);
  const loading = useSelector((state) => state.order?.loading);

  const fetchOrders = useCallback(() => {
    return dispatch(fetchOrdersThunk());
  }, [dispatch]);

  const checkout = useCallback(
    async (cart) => {
      const res = await dispatch(placeOrder(cart));
      if (placeOrder.fulfilled.match(res)) {
        dispatch(clearCart());
      }
      return res;
    },
    [dispatch],
  );

  const clearCurrentOrder = useCallback(() => {
    dispatch(clearCurrentOrderAction());
  }, [dispatch]);

  return {
    orders,
    loading,
    checkout,
    fetchOrders,
    clearCurrentOrder,
  };
};

export default useOrders;
