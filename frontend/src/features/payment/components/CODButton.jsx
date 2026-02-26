import usePayment from "../hooks/usePayment";
import { Banknote } from "lucide-react";
import { AppButton } from "@/shared/ui";

const CODButton = () => {
  const payment = usePayment();

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
      <p className="mb-3 text-sm text-gray-700">
        You will pay in cash at the time of delivery.
      </p>
      <AppButton
        onClick={payment.payCOD}
        disabled={payment.loading}
        fullWidth
        variant="warning"
      >
        <Banknote size={17} />
        {payment.loading ? "Processing..." : "Confirm Cash on Delivery"}
      </AppButton>
    </div>
  );
};

export default CODButton;
