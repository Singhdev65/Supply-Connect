import { createContext, useContext, useState } from "react";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [orderId, setOrderId] = useState(null);
  const [method, setMethod] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <PaymentContext.Provider
      value={{
        orderId,
        setOrderId,
        method,
        setMethod,
        paymentData,
        setPaymentData,
        loading,
        setLoading,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => useContext(PaymentContext);
