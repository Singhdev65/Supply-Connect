import { AppCard, AppButton } from "@/shared/ui";

const money = (value = 0) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(
    Number(value || 0),
  );

const VendorFinancePanel = ({
  days,
  setDays,
  summary,
  transactions,
  payouts,
  taxReport,
  loading,
  requestAmount,
  setRequestAmount,
  requestPayout,
  requesting,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
        Loading finance data...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Finance Dashboard</h3>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={180}>Last 180 days</option>
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <AppCard className="p-4">
          <p className="text-xs text-gray-500">Gross Sales</p>
          <p className="text-xl font-semibold text-gray-900">{money(summary?.summary?.grossSales)}</p>
        </AppCard>
        <AppCard className="p-4">
          <p className="text-xs text-gray-500">Net Earnings</p>
          <p className="text-xl font-semibold text-emerald-600">{money(summary?.summary?.netEarnings)}</p>
        </AppCard>
        <AppCard className="p-4">
          <p className="text-xs text-gray-500">Paid Out</p>
          <p className="text-xl font-semibold text-gray-900">{money(summary?.summary?.paidOut)}</p>
        </AppCard>
        <AppCard className="p-4">
          <p className="text-xs text-gray-500">Available</p>
          <p className="text-xl font-semibold text-blue-700">{money(summary?.summary?.availableForPayout)}</p>
        </AppCard>
      </div>

      <AppCard className="p-4">
        <p className="text-sm font-semibold text-gray-900">Request Payout</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="number"
            min={1}
            value={requestAmount}
            onChange={(e) => setRequestAmount(e.target.value)}
            placeholder="Amount"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <AppButton onClick={requestPayout} disabled={requesting}>
            {requesting ? "Requesting..." : "Request Payout"}
          </AppButton>
        </div>
      </AppCard>

      <AppCard className="p-4">
        <p className="text-sm font-semibold text-gray-900">Recent Transactions</p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-gray-500">
                <th className="py-2 pr-4">Order</th>
                <th className="py-2 pr-4">Gross</th>
                <th className="py-2 pr-4">Commission</th>
                <th className="py-2 pr-4">Tax</th>
                <th className="py-2 pr-4">Net</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b last:border-none">
                  <td className="py-2 pr-4 text-gray-700">#{String(txn.orderId).slice(-8).toUpperCase()}</td>
                  <td className="py-2 pr-4">{money(txn.gross)}</td>
                  <td className="py-2 pr-4">{money(txn.commission)}</td>
                  <td className="py-2 pr-4">{money((txn.gstOnCommission || 0) + (txn.tds || 0))}</td>
                  <td className="py-2 pr-4 font-semibold text-emerald-600">{money(txn.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AppCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <AppCard className="p-4">
          <p className="text-sm font-semibold text-gray-900">Payout History</p>
          <div className="mt-3 space-y-2">
            {payouts.length ? payouts.map((entry) => (
              <div key={entry._id} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                <p className="font-medium text-gray-900">{money(entry.amount)}</p>
                <p className="text-xs text-gray-600">
                  Status: {entry.status} | {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "N/A"}
                </p>
              </div>
            )) : <p className="text-sm text-gray-600">No payouts requested yet.</p>}
          </div>
        </AppCard>

        <AppCard className="p-4">
          <p className="text-sm font-semibold text-gray-900">Tax Snapshot</p>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>Gross Sales: <span className="font-semibold">{money(taxReport?.totals?.grossSales)}</span></p>
            <p>Commission: <span className="font-semibold">{money(taxReport?.totals?.commission)}</span></p>
            <p>GST on Commission: <span className="font-semibold">{money(taxReport?.totals?.gstOnCommission)}</span></p>
            <p>TDS: <span className="font-semibold">{money(taxReport?.totals?.tds)}</span></p>
            <p>Net Earnings: <span className="font-semibold text-emerald-600">{money(taxReport?.totals?.netEarnings)}</span></p>
          </div>
        </AppCard>
      </div>
    </div>
  );
};

export default VendorFinancePanel;
