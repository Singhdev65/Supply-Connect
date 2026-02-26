import {
  createPaymentOrder,
  generateUPIQR,
  verifyRazorpayPayment,
  confirmCOD,
} from "../api";
import { usePaymentContext } from "../context/PaymentContext";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/utils/constants";
import { useCallback } from "react";

const usePayment = () => {
  const ctx = usePaymentContext();
  const {
    orderId,
    setMethod,
    setLoading,
    setPaymentData,
  } = ctx;
  const navigate = useNavigate();

  const selectMethod = useCallback(async (method, targetOrderId = orderId) => {
    try {
      setMethod(method);
      setLoading(true);
      const data = await createPaymentOrder(targetOrderId, method);
      setPaymentData(data);
    } finally {
      setLoading(false);
    }
  }, [orderId, setLoading, setMethod, setPaymentData]);

  const payCOD = useCallback(async () => {
    try {
      setLoading(true);
      await confirmCOD(orderId);
      navigate(PATHS.BUYER_ORDER_SUCCESS, {
        state: { orderId },
      });
    } finally {
      setLoading(false);
    }
  }, [orderId, setLoading, navigate]);

  const generateQR = useCallback(async () => {
    try {
      setLoading(true);
      const data = await generateUPIQR(orderId);
      setPaymentData(data);
    } finally {
      setLoading(false);
    }
  }, [orderId, setLoading, setPaymentData]);

  const verifyRazorpay = useCallback(async (payload) => {
    try {
      setLoading(true);
      await verifyRazorpayPayment(payload);
      navigate(PATHS.BUYER_ORDER_SUCCESS, {
        state: { orderId },
      });
    } finally {
      setLoading(false);
    }
  }, [orderId, setLoading, navigate]);

  return {
    ...ctx,
    selectMethod,
    payCOD,
    generateQR,
    verifyRazorpay,
  };
};

export default usePayment;
