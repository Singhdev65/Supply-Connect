import { CreditCard } from "lucide-react";

const PaymentSummaryCard = ({ method, amount }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
      <div className="mb-2 flex items-center gap-2">
        <CreditCard size={17} className="text-gray-700" />
        <p className="font-semibold text-gray-900">Payment summary</p>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Selected method</span>
          <span className="font-medium text-gray-900">{method || "Not selected"}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Amount to pay</span>
          <span className="text-lg font-bold text-gray-900">
            {amount > 0 ? `Rs ${Number(amount).toFixed(2)}` : "Will show after method selection"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;
