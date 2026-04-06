const {
  orderRepository,
  payoutRepository,
} = require("../repositories");

const COMMISSION_RATE = Number(process.env.VENDOR_COMMISSION_RATE || 0.1);
const GST_ON_COMMISSION_RATE = Number(process.env.VENDOR_GST_ON_COMMISSION_RATE || 0.18);
const TDS_RATE = Number(process.env.VENDOR_TDS_RATE || 0.01);
const EARNING_STATUSES = new Set(["Delivered", "Completed"]);
const REFUND_STATUSES = new Set(["Refunded"]);

const toDateRange = ({ days = 30, from, to } = {}) => {
  if (from && to) {
    const start = new Date(from);
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - (Math.max(1, Number(days) || 30) - 1));
  start.setHours(0, 0, 0, 0);
  return { start, end };
};

const asMoney = (value) => Number(Number(value || 0).toFixed(2));

const buildTransactions = (orders, vendorId) => {
  const transactions = [];

  for (const order of orders) {
    const sign = REFUND_STATUSES.has(order.status) ? -1 : 1;
    for (const item of order.items || []) {
      if (String(item.vendor) !== String(vendorId)) continue;
      if (!EARNING_STATUSES.has(order.status) && !REFUND_STATUSES.has(order.status)) continue;

      const gross = asMoney(Number(item.price || 0) * Number(item.qty || 0) * sign);
      const commission = asMoney(gross * COMMISSION_RATE);
      const gstOnCommission = asMoney(commission * GST_ON_COMMISSION_RATE);
      const tds = asMoney(gross * TDS_RATE);
      const net = asMoney(gross - commission - gstOnCommission - tds);

      transactions.push({
        id: `${order._id}-${item.product?._id || item.product}`,
        orderId: order._id,
        date: order.updatedAt || order.createdAt,
        status: order.status,
        productId: item.product?._id || item.product,
        productName: item.name || item.product?.name || "Product",
        qty: Number(item.qty || 0),
        gross,
        commission,
        gstOnCommission,
        tds,
        net,
      });
    }
  }

  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  return transactions;
};

const aggregate = (transactions) =>
  transactions.reduce(
    (acc, txn) => {
      acc.gross += txn.gross;
      acc.commission += txn.commission;
      acc.gstOnCommission += txn.gstOnCommission;
      acc.tds += txn.tds;
      acc.net += txn.net;
      return acc;
    },
    { gross: 0, commission: 0, gstOnCommission: 0, tds: 0, net: 0 },
  );

const monthlyBreakdown = (transactions) => {
  const map = new Map();
  for (const txn of transactions) {
    const date = new Date(txn.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const current = map.get(key) || { month: key, gross: 0, commission: 0, gstOnCommission: 0, tds: 0, net: 0 };
    current.gross += txn.gross;
    current.commission += txn.commission;
    current.gstOnCommission += txn.gstOnCommission;
    current.tds += txn.tds;
    current.net += txn.net;
    map.set(key, current);
  }

  return [...map.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((row) => ({
      ...row,
      gross: asMoney(row.gross),
      commission: asMoney(row.commission),
      gstOnCommission: asMoney(row.gstOnCommission),
      tds: asMoney(row.tds),
      net: asMoney(row.net),
    }));
};

exports.getFinanceSummary = async (authUser, query = {}) => {
  const { start, end } = toDateRange(query);
  const orders = await orderRepository.findByVendorWithinRange(authUser.id, start, end);
  const transactions = buildTransactions(orders, authUser.id);
  const totals = aggregate(transactions);

  const [payouts, paidOut] = await Promise.all([
    payoutRepository.findByVendor(authUser.id),
    payoutRepository.totalPaidByVendor(authUser.id),
  ]);

  const pendingPayout = payouts
    .filter((entry) => ["requested", "approved"].includes(entry.status))
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  const availableForPayout = Math.max(asMoney(totals.net) - asMoney(paidOut) - asMoney(pendingPayout), 0);

  return {
    range: { from: start, to: end },
    rates: {
      commissionRate: COMMISSION_RATE,
      gstOnCommissionRate: GST_ON_COMMISSION_RATE,
      tdsRate: TDS_RATE,
    },
    summary: {
      grossSales: asMoney(totals.gross),
      commission: asMoney(totals.commission),
      gstOnCommission: asMoney(totals.gstOnCommission),
      tds: asMoney(totals.tds),
      netEarnings: asMoney(totals.net),
      paidOut: asMoney(paidOut),
      pendingPayout: asMoney(pendingPayout),
      availableForPayout: asMoney(availableForPayout),
    },
  };
};

exports.getTransactions = async (authUser, query = {}) => {
  const { start, end } = toDateRange(query);
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));

  const orders = await orderRepository.findByVendorWithinRange(authUser.id, start, end);
  const transactions = buildTransactions(orders, authUser.id);

  const total = transactions.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const data = transactions.slice(startIndex, startIndex + limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
};

exports.getPayouts = (authUser) => payoutRepository.findByVendor(authUser.id);

exports.requestPayout = async (authUser, payload = {}) => {
  const amount = Number(payload.amount || 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw { message: "Invalid payout amount", statusCode: 400 };
  }

  const summary = await exports.getFinanceSummary(authUser, { days: 180 });
  if (amount > summary.summary.availableForPayout) {
    throw { message: "Requested amount exceeds available balance", statusCode: 400 };
  }

  return payoutRepository.create({
    vendor: authUser.id,
    amount: asMoney(amount),
    note: payload.note || "",
    status: "requested",
  });
};

exports.getTaxReport = async (authUser, query = {}) => {
  const { start, end } = toDateRange(query);
  const orders = await orderRepository.findByVendorWithinRange(authUser.id, start, end);
  const transactions = buildTransactions(orders, authUser.id);
  const totals = aggregate(transactions);

  return {
    range: { from: start, to: end },
    totals: {
      grossSales: asMoney(totals.gross),
      commission: asMoney(totals.commission),
      gstOnCommission: asMoney(totals.gstOnCommission),
      tds: asMoney(totals.tds),
      netEarnings: asMoney(totals.net),
    },
    monthlyBreakdown: monthlyBreakdown(transactions),
  };
};
