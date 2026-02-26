import { useMemo } from "react";
import { useSelector } from "react-redux";

const useOrderAmount = (orderId) => {
  const currentOrder = useSelector((state) => state.order?.currentOrder?.data);
  const orders = useSelector((state) => state.order?.orders?.data || []);

  return useMemo(() => {
    if (!orderId) return null;
    if (currentOrder?._id === orderId) return Number(currentOrder.totalAmount || 0);

    const matchedOrder = orders.find((order) => order._id === orderId);
    return matchedOrder ? Number(matchedOrder.totalAmount || 0) : null;
  }, [orderId, currentOrder, orders]);
};

export default useOrderAmount;

