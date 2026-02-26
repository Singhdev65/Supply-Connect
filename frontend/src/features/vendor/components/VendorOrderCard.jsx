import { useMemo, useState } from "react";
import { AppButton, AppCard, OrderStatusBadge } from "@/shared/ui";
import { VENDOR_ORDER_STATUSES } from "@/utils/constants";

const VendorOrderCard = ({ order, onStatusUpdate }) => {
  const [nextStatus, setNextStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const itemSummary = useMemo(
    () => order.items?.reduce((sum, item) => sum + Number(item.qty || 0), 0) || 0,
    [order.items],
  );

  const orderValue = useMemo(
    () =>
      order.items?.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0) ||
      0,
    [order.items],
  );

  const handleUpdate = async () => {
    if (!nextStatus || nextStatus === order.status) return;
    setUpdating(true);
    try {
      await onStatusUpdate(order._id, nextStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AppCard className="border-gray-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Order #{order._id?.slice(-8)?.toUpperCase()}</p>
          <p className="text-xs text-gray-500">
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
          </p>
          <p className="text-xs text-gray-600">
            Buyer: {order.buyer?.name || "Unknown"} {order.buyer?.email ? `(${order.buyer.email})` : ""}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Items</p>
          <p className="font-semibold text-gray-900">{order.items?.length || 0}</p>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Quantity</p>
          <p className="font-semibold text-gray-900">{itemSummary}</p>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Order Value</p>
          <p className="font-semibold text-gray-900">Rs {orderValue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Current Stage</p>
          <p className="font-semibold text-gray-900">{order.status}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
          className="min-w-[220px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
        >
          {VENDOR_ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <AppButton onClick={handleUpdate} disabled={updating || nextStatus === order.status}>
          {updating ? "Updating..." : "Update Status"}
        </AppButton>
      </div>
    </AppCard>
  );
};

export default VendorOrderCard;
