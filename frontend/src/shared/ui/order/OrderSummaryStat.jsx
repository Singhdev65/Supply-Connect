const OrderSummaryStat = ({ label, value, className = "" }) => {
  return (
    <div className={`rounded-lg bg-gray-50 p-3 ${className}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
};

export default OrderSummaryStat;
