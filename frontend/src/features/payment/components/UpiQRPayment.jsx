import { useEffect } from "react";
import usePayment from "../hooks/usePayment";
import PaymentTimer from "./PaymentTimer";
import { QrCode } from "lucide-react";

const UpiQRPayment = () => {
  const payment = usePayment();

  useEffect(() => {
    payment.generateQR();
  }, []);

  if (!payment.paymentData) return null;

  return (
    <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-2">
        <QrCode size={18} className="text-emerald-700" />
        <p className="font-semibold text-gray-900">Scan UPI QR to pay</p>
      </div>

      <div className="rounded-xl bg-white p-4 text-center">
        <img
          src={payment.paymentData.qrImage}
          alt="UPI QR"
          className="mx-auto w-56 md:w-64"
        />
      </div>

      <PaymentTimer expiry={payment.paymentData.expiresAt} />
    </div>
  );
};

export default UpiQRPayment;
