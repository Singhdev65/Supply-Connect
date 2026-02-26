import { ShieldCheck } from "lucide-react";

const PaymentHero = ({ orderId }) => {
  return (
    <div className="mb-6 rounded-2xl border border-orange-100 bg-gradient-to-r from-[#ffedd5] to-[#fff7ed] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            Secure Checkout
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Complete your payment</h1>
          <p className="text-sm text-gray-600">Order ID: {orderId || "N/A"}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">
          <ShieldCheck size={18} className="text-green-600" />
          <span className="text-sm font-medium text-gray-700">100% secure payments</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentHero;
