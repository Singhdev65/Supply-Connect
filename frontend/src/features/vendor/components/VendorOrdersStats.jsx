import { AppCard } from "@/shared/ui";

const VendorOrdersStats = ({ orderStats }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <AppCard className="p-4">
        <p className="text-xs text-gray-500">Received Orders</p>
        <p className="text-xl font-semibold text-gray-900">{orderStats.total}</p>
      </AppCard>
      <AppCard className="p-4">
        <p className="text-xs text-gray-500">In Transit</p>
        <p className="text-xl font-semibold text-gray-900">{orderStats.inTransit}</p>
      </AppCard>
      <AppCard className="p-4">
        <p className="text-xs text-gray-500">Delivered</p>
        <p className="text-xl font-semibold text-gray-900">{orderStats.delivered}</p>
      </AppCard>
    </div>
  );
};

export default VendorOrdersStats;
