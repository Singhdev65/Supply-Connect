import { AppCard } from "@/shared/ui";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

const MetricCard = ({ title, value, subtitle, tone = "text-gray-900" }) => (
  <AppCard className="p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{title}</p>
    <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
    {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
  </AppCard>
);

const VendorAnalyticsPanel = ({
  report,
  loading,
  reportDays,
  setReportDays,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
        Loading analytics...
      </div>
    );
  }

  const summary = report?.summary || {};
  const series = report?.series || [];
  const maxRevenue = Math.max(...series.map((point) => point.revenue), 1);
  const recentSeries = series.slice(-14);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sales Analytics</h3>
          <p className="text-sm text-gray-500">
            Revenue and profit trends for the selected period
          </p>
        </div>
        <select
          value={reportDays}
          onChange={(e) => setReportDays(Number(e.target.value))}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={180}>Last 180 days</option>
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Revenue"
          value={formatCurrency(summary.totalRevenue)}
          subtitle={`${summary.totalOrders || 0} delivered/completed orders`}
        />
        <MetricCard
          title="Profit"
          value={formatCurrency(summary.totalProfit)}
          subtitle={`Margin ${(Number(summary.profitMargin || 0) * 100).toFixed(0)}%`}
          tone="text-emerald-600"
        />
        <MetricCard
          title="Units Sold"
          value={summary.totalUnitsSold || 0}
          subtitle="Total quantity sold"
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(summary.avgOrderValue)}
          subtitle="Revenue / orders"
        />
      </div>

      <AppCard className="p-4">
        <p className="text-sm font-semibold text-gray-900">Revenue Trend (Last 14 points)</p>
        <div
          className="mt-4 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${recentSeries.length || 1}, minmax(0, 1fr))` }}
        >
          {recentSeries.map((point) => {
            const barHeight = Math.max((point.revenue / maxRevenue) * 180, 4);
            return (
              <div key={point.date} className="flex flex-col items-center gap-2">
                <div className="relative flex h-48 w-full items-end justify-center rounded-md bg-gray-50">
                  <div
                    className="w-5 rounded-t bg-gradient-to-t from-indigo-500 to-blue-400"
                    style={{ height: `${barHeight}px` }}
                    title={`${formatDate(point.date)}: ${formatCurrency(point.revenue)}`}
                  />
                </div>
                <span className="text-[10px] text-gray-500">{formatDate(point.date)}</span>
              </div>
            );
          })}
        </div>
      </AppCard>

      <AppCard className="p-4">
        <p className="text-sm font-semibold text-gray-900">Daily Performance</p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-gray-500">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Orders</th>
                <th className="py-2 pr-4">Units</th>
                <th className="py-2 pr-4">Revenue</th>
                <th className="py-2 pr-4">Profit</th>
              </tr>
            </thead>
            <tbody>
              {series.slice().reverse().slice(0, 10).map((point) => (
                <tr key={point.date} className="border-b last:border-none">
                  <td className="py-2 pr-4 text-gray-700">{formatDate(point.date)}</td>
                  <td className="py-2 pr-4 text-gray-700">{point.orderCount}</td>
                  <td className="py-2 pr-4 text-gray-700">{point.unitsSold}</td>
                  <td className="py-2 pr-4 font-medium text-gray-900">
                    {formatCurrency(point.revenue)}
                  </td>
                  <td className="py-2 pr-4 font-medium text-emerald-600">
                    {formatCurrency(point.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>
  );
};

export default VendorAnalyticsPanel;
