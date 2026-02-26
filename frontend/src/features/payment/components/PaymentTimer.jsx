import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

const PaymentTimer = ({ expiry }) => {
  const [time, setTime] = useState(() => {
    if (!expiry) return 600;
    const diff = Math.floor((new Date(expiry).getTime() - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  });

  useEffect(() => {
    if (time <= 0) return undefined;

    const interval = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
      <Clock3 size={14} />
      QR expires in {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
    </div>
  );
};

export default PaymentTimer;
