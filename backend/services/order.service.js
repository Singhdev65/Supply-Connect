const {
  orderRepository,
  productRepository,
  reviewRepository,
  userRepository,
} = require("../repositories");
const { USER_ROLES } = require("../config/roles");

const VENDOR_UPDATABLE_STATUSES = [
  "Accepted by Vendor",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const REVENUE_STATUSES = ["Delivered", "Completed"];
const DEFAULT_PROFIT_MARGIN = Number(process.env.VENDOR_DEFAULT_PROFIT_MARGIN || 0.22);
const MAX_REPORT_DAYS = 180;

exports.placeOrder = async ({ items, addressId, deliveryNotes }, user) => {
  if (!items?.length) throw { message: "Cart is empty", statusCode: 400 };
  if (!addressId) throw { message: "Delivery address is required", statusCode: 400 };

  const buyer = await userRepository.findById(user.id);
  if (!buyer) throw { message: "User not found", statusCode: 404 };

  const address = buyer.addresses?.id(addressId);
  if (!address) throw { message: "Selected address not found", statusCode: 400 };

  let totalAmount = 0;
  let orderItems = [];

  for (const item of items) {
    const product = await productRepository.findById(item.product);
    if (!product) throw { message: "Product not found", statusCode: 404 };

    const qty = item.qty ?? item.quantity;

    if (product.stock < qty)
      throw { message: "Not enough stock", statusCode: 400 };

    product.stock -= qty;
    await productRepository.save(product);

    totalAmount += product.price * qty;

    orderItems.push({
      product: product._id,
      qty,
      name: product.name,
      image: product.images[0],
      price: product.price,
      vendor: product.vendor,
    });
  }

  return orderRepository.create({
    buyer: user.id,
    items: orderItems,
    totalAmount,
    shippingAddress: {
      addressId: address._id,
      label: address.label || "",
      recipientName: address.recipientName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || "",
      landmark: address.landmark || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    },
    deliveryNotes: deliveryNotes || "",
    status: "Pending Payment",
  });
};

exports.getOrders = async (user) => {
  if (user.role === USER_ROLES.BUYER) {
    const [orders, reviews] = await Promise.all([
      orderRepository.findByBuyer(user.id),
      reviewRepository.findByReviewer(user.id),
    ]);

    const reviewedProductIds = new Set(
      reviews.map((review) => String(review.product)),
    );

    return orders.map((order) => ({
      ...order.toObject(),
      items: (order.items || []).map((item) => ({
        ...item.toObject(),
        hasReviewed: reviewedProductIds.has(String(item.product?._id || item.product)),
      })),
    }));
  }

  if (user.role === USER_ROLES.VENDOR) {
    const orders = await orderRepository.findByVendor(user.id);

    return orders.map((order) => {
      const vendorItems = order.items.filter(
        (item) => String(item.vendor) === String(user.id),
      );

      return {
        ...order.toObject(),
        items: vendorItems,
      };
    });
  }

  return orderRepository.findAll();
};

exports.getVendorSalesReport = async (user, { days = 30 } = {}) => {
  if (user.role !== USER_ROLES.VENDOR) {
    throw { message: "Unauthorized", statusCode: 403 };
  }

  const normalizedDays = Math.max(7, Math.min(Number(days) || 30, MAX_REPORT_DAYS));
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (normalizedDays - 1));
  startDate.setHours(0, 0, 0, 0);

  const rows = await orderRepository.aggregateVendorSalesByDay(
    user.id,
    startDate,
    endDate,
    REVENUE_STATUSES,
  );

  const rowByDate = new Map(rows.map((row) => [row.date, row]));
  const series = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const date = cursor.toISOString().slice(0, 10);
    const row = rowByDate.get(date);
    const revenue = Number(row?.revenue || 0);
    const profit = Number((revenue * DEFAULT_PROFIT_MARGIN).toFixed(2));

    series.push({
      date,
      revenue,
      profit,
      unitsSold: Number(row?.unitsSold || 0),
      orderCount: Number(row?.orderCount || 0),
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  const totals = series.reduce(
    (acc, entry) => {
      acc.revenue += entry.revenue;
      acc.profit += entry.profit;
      acc.unitsSold += entry.unitsSold;
      acc.orders += entry.orderCount;
      return acc;
    },
    { revenue: 0, profit: 0, unitsSold: 0, orders: 0 },
  );

  const avgOrderValue = totals.orders ? totals.revenue / totals.orders : 0;

  return {
    rangeDays: normalizedDays,
    summary: {
      totalRevenue: Number(totals.revenue.toFixed(2)),
      totalProfit: Number(totals.profit.toFixed(2)),
      totalUnitsSold: totals.unitsSold,
      totalOrders: totals.orders,
      avgOrderValue: Number(avgOrderValue.toFixed(2)),
      profitMargin: DEFAULT_PROFIT_MARGIN,
    },
    series,
  };
};

exports.updateVendorOrderStatus = async (orderId, status, user) => {
  if (!VENDOR_UPDATABLE_STATUSES.includes(status)) {
    throw { message: "Invalid order status", statusCode: 400 };
  }

  const order = await orderRepository.findById(orderId);
  if (!order) throw { message: "Order not found", statusCode: 404 };

  const isVendorOrder = order.items?.some(
    (item) => String(item.vendor) === String(user.id),
  );

  if (!isVendorOrder) {
    throw { message: "Unauthorized to update this order", statusCode: 403 };
  }

  return orderRepository.update(orderId, { status });
};
