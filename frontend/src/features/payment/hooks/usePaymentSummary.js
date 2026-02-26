import { useMemo } from "react";
import { useOrderAmount } from "@/shared/hooks";

const usePaymentSummary = (orderId, paymentData) => {
  const orderAmount = useOrderAmount(orderId);

  return useMemo(
    () => Number(paymentData?.amount ?? orderAmount ?? 0),
    [paymentData?.amount, orderAmount],
  );
};

export default usePaymentSummary;

