import usePayment from "../hooks/usePayment";
import { Banknote, QrCode, Wallet } from "lucide-react";
import { PAYMENT_METHODS } from "@/utils/constants";

const PaymentMethods = () => {
  const payment = usePayment();
  const methods = [
    {
      key: PAYMENT_METHODS.RAZORPAY,
      title: "Cards, Netbanking, Wallets",
      subtitle: "Pay via Razorpay gateway",
      icon: <Wallet size={18} className="text-indigo-700" />,
    },
    {
      key: PAYMENT_METHODS.UPI,
      title: "UPI QR",
      subtitle: "Scan and pay instantly",
      icon: <QrCode size={18} className="text-emerald-700" />,
    },
    {
      key: PAYMENT_METHODS.COD,
      title: "Cash on Delivery",
      subtitle: "Pay at your doorstep",
      icon: <Banknote size={18} className="text-orange-700" />,
    },
  ];

  return (
    <div className="space-y-4">
      {methods.map((method) => {
        const active = payment.method === method.key;
        return (
          <button
            key={method.key}
            onClick={() => payment.selectMethod(method.key)}
            className={`w-full rounded-xl border p-4 text-left transition ${
              active
                ? "border-orange-400 bg-orange-50 ring-1 ring-orange-200"
                : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/40"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5">{method.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900">{method.title}</p>
                  <p className="text-sm text-gray-500">{method.subtitle}</p>
                </div>
              </div>
              <span
                className={`mt-1 h-4 w-4 rounded-full border ${
                  active ? "border-orange-500 bg-orange-500" : "border-gray-300"
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PaymentMethods;
