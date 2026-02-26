import { PaymentProvider } from "../context/PaymentContext";
import usePayment from "../hooks/usePayment";
import useInitializePayment from "../hooks/useInitializePayment";
import usePaymentSummary from "../hooks/usePaymentSummary";
import {
  CODButton,
  PaymentHero,
  PaymentMethods,
  PaymentSummaryCard,
  RazorpayButton,
  UpiQRPayment,
} from "../components";
import { ShieldCheck, Truck, WalletCards } from "lucide-react";
import { useParams } from "react-router-dom";
import { PAYMENT_METHODS, PATHS } from "@/utils/constants";
import { Breadcrumbs } from "@/shared/ui";

const PaymentContent = ({ routeOrderId }) => {
  const payment = usePayment();
  useInitializePayment({
    orderId: routeOrderId,
    method: payment.method,
    setOrderId: payment.setOrderId,
    selectMethod: payment.selectMethod,
  });

  const amount = usePaymentSummary(routeOrderId, payment.paymentData);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <Breadcrumbs
          showBack
          items={[
            { label: "Home", to: PATHS.BUYER_HOME },
            { label: "Checkout", to: PATHS.BUYER_CHECKOUT },
            { label: "Payment" },
          ]}
        />
        <PaymentHero orderId={payment.orderId} />

        <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
            <div className="flex items-center gap-2">
              <WalletCards size={18} className="text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Choose payment method</h2>
            </div>
            <PaymentMethods />

            {payment.method === PAYMENT_METHODS.COD && <CODButton />}
            {payment.method === PAYMENT_METHODS.RAZORPAY && <RazorpayButton />}
            {payment.method === PAYMENT_METHODS.UPI && <UpiQRPayment />}
          </div>

          <div className="space-y-4">
            <PaymentSummaryCard method={payment.method} amount={amount} />

            <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
              <p className="mb-3 text-sm font-semibold text-gray-900">Why customers trust this checkout</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-green-600" />
                  End-to-end encrypted payment flow
                </li>
                <li className="flex items-center gap-2">
                  <Truck size={15} className="text-orange-600" />
                  Instant order confirmation after successful payment
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const { orderId } = useParams();

  return (
    <PaymentProvider>
      <PaymentContent routeOrderId={orderId} />
    </PaymentProvider>
  );
};

export default PaymentPage;
