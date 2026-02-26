import { useEffect } from "react";
import { PAYMENT_METHODS } from "@/utils/constants";

const useInitializePayment = ({ orderId, method, setOrderId, selectMethod }) => {
  useEffect(() => {
    if (!orderId) return;
    setOrderId(orderId);
  }, [orderId, setOrderId]);

  useEffect(() => {
    if (!orderId || method) return;
    selectMethod(PAYMENT_METHODS.RAZORPAY, orderId);
  }, [orderId, method, selectMethod]);
};

export default useInitializePayment;
