import { EmptyState } from "@/shared/ui";
import VendorOrderCard from "./VendorOrderCard";

const VendorOrdersPanel = ({ orders, loading, onStatusUpdate }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
        Loading orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="You will see new buyer orders here once they are placed."
        className="h-[40vh]"
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <VendorOrderCard key={order._id} order={order} onStatusUpdate={onStatusUpdate} />
      ))}
    </div>
  );
};

export default VendorOrdersPanel;
