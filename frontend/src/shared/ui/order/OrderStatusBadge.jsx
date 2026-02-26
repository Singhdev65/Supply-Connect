const STATUS_CLASS_MAP = {
  "Pending Payment": "bg-amber-100 text-amber-800",
  Paid: "bg-emerald-100 text-emerald-800",
  "Accepted by Vendor": "bg-blue-100 text-blue-800",
  Packed: "bg-indigo-100 text-indigo-800",
  Shipped: "bg-cyan-100 text-cyan-800",
  "Out for Delivery": "bg-orange-100 text-orange-800",
  Delivered: "bg-green-100 text-green-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-rose-100 text-rose-800",
  Returned: "bg-rose-100 text-rose-800",
  Refunded: "bg-purple-100 text-purple-800",
};

const OrderStatusBadge = ({ status = "Pending Payment", className = "" }) => {
  const style = STATUS_CLASS_MAP[status] || "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style} ${className}`}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;

