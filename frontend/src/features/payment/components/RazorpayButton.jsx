import usePayment from "../hooks/usePayment";
import { CreditCard } from "lucide-react";
import { AppButton } from "@/shared/ui";

const RazorpayButton = () => {
  const payment = usePayment();

  const startPayment = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: payment.paymentData.amount,
      currency: "INR",
      order_id: payment.paymentData.razorpayOrderId,

      handler: function (response) {
        payment.verifyRazorpay({
          orderId: payment.orderId,
          ...response,
        });
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <p className="mb-3 text-sm text-gray-700">
        Use UPI, cards, wallets, or netbanking securely with Razorpay.
      </p>
      <AppButton
        onClick={startPayment}
        disabled={payment.loading}
        fullWidth
      >
        <CreditCard size={17} />
        {payment.loading ? "Preparing gateway..." : "Pay with Razorpay"}
      </AppButton>
    </div>
  );
};

export default RazorpayButton;
