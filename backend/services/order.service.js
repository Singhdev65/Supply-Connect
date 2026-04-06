const {
  orderRepository,
  productRepository,
  reviewRepository,
  userRepository,
} = require("../repositories");
const promotionService = require("./promotion.service");
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
const BUYER_CANCELABLE_STATUSES = ["Pending Payment", "Paid", "Accepted by Vendor", "Packed"];

const ORDER_STATUS_TIMELINE = [
  "Pending Payment",
  "Paid",
  "Accepted by Vendor",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Completed",
];

exports.placeOrder = async ({ items, addressId, deliveryNotes, couponCode }, user) => {
  if (!items?.length) throw { message: "Cart is empty", statusCode: 400 };
  if (!addressId) throw { message: "Delivery address is required", statusCode: 400 };

  const buyer = await userRepository.findById(user.id);
  if (!buyer) throw { message: "User not found", statusCode: 404 };

  const address = buyer.addresses?.id(addressId);
  if (!address) throw { message: "Selected address not found", statusCode: 400 };

  const resolvedItems = [];

  for (const item of items) {
    const product = await productRepository.findById(item.product);
    if (!product) throw { message: "Product not found", statusCode: 404 };

    const qty = Number(item.qty ?? item.quantity ?? 0);
    if (!Number.isFinite(qty) || qty < 1) {
      throw { message: "Invalid quantity", statusCode: 400 };
    }

    if (product.stock < qty) {
      throw { message: "Not enough stock", statusCode: 400 };
    }

    resolvedItems.push({ product, qty });
  }

  const orderItems = resolvedItems.map(({ product, qty }) => ({
    product: product._id,
    qty,
    name: product.name,
    image: product.images[0],
    price: product.price,
    vendor: product.vendor,
  }));

  const lineItems = resolvedItems.map(({ product, qty }) => ({
    productId: product._id,
    vendor: product.vendor,
    category: product.category,
    qty,
    price: Number(product.price || 0),
    lineTotal: Number(product.price || 0) * qty,
  }));

  const subtotalAmount = Number(
    lineItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2),
  );

  let discountAmount = 0;
  let appliedPromotion = null;

  if (couponCode) {
    const promotionResolution = await promotionService.resolvePromotionForOrder({
      couponCode,
      lineItems,
      buyerId: user.id,
    });

    if (promotionResolution) {
      discountAmount = Number(promotionResolution.result.discountAmount || 0);
      appliedPromotion = {
        promotion: promotionResolution.promotion._id,
        code: promotionResolution.result.code,
        title: promotionResolution.result.title,
        discountType: promotionResolution.result.discountType,
        discountValue: promotionResolution.result.discountValue,
        discountAmount: promotionResolution.result.discountAmount,
        vendor: promotionResolution.result.vendor,
      };
    }
  }

  const totalAmount = Number(Math.max(subtotalAmount - discountAmount, 0).toFixed(2));

  for (const { product, qty } of resolvedItems) {
    product.stock -= qty;
    await productRepository.save(product);
  }

  const created = await orderRepository.create({
    buyer: user.id,
    items: orderItems,
    subtotalAmount,
    discountAmount,
    totalAmount,
    appliedPromotion,
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

  if (appliedPromotion?.promotion) {
    await promotionService.incrementUsage(appliedPromotion.promotion);
  }

  return created;
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

  const next = { status };
  if (status === "Delivered" || status === "Completed") next.escrowStatus = "released";
  if (status === "Cancelled") next.escrowStatus = "refunded";
  return orderRepository.update(orderId, next);
};

exports.cancelBuyerOrder = async (orderId, user, reason = "") => {
  const order = await orderRepository.findById(orderId);
  if (!order) throw { message: "Order not found", statusCode: 404 };
  if (String(order.buyer) !== String(user.id)) {
    throw { message: "Unauthorized", statusCode: 403 };
  }

  if (!BUYER_CANCELABLE_STATUSES.includes(order.status)) {
    throw { message: "Order can no longer be cancelled", statusCode: 400 };
  }

  if (order.status === "Cancelled") return order;

  for (const item of order.items || []) {
    const product = await productRepository.findById(item.product);
    if (product) {
      product.stock += Number(item.qty || 0);
      await productRepository.save(product);
    }
  }

  const note = reason ? `Cancelled by buyer: ${reason}` : "Cancelled by buyer";
  return orderRepository.update(orderId, { status: "Cancelled", deliveryNotes: note, escrowStatus: "refunded" });
};

exports.reorder = async (orderId, user) => {
  const order = await orderRepository.findByIdWithRelations(orderId);
  if (!order) throw { message: "Order not found", statusCode: 404 };
  if (String(order.buyer?._id || order.buyer) !== String(user.id)) {
    throw { message: "Unauthorized", statusCode: 403 };
  }

  const items = (order.items || []).map((item) => ({
    product: item.product?._id || item.product,
    qty: Number(item.qty || 1),
  }));

  return exports.placeOrder(
    {
      items,
      addressId: order.shippingAddress?.addressId,
      deliveryNotes: `Reorder of ${order._id}`,
    },
    user,
  );
};

exports.getOrderTracking = async (orderId, user) => {
  const order = await orderRepository.findByIdWithRelations(orderId);
  if (!order) throw { message: "Order not found", statusCode: 404 };

  const isBuyer = String(order.buyer?._id || order.buyer) === String(user.id);
  const isVendor = (order.items || []).some(
    (item) => String(item.vendor) === String(user.id),
  );

  if (!isBuyer && !isVendor) {
    throw { message: "Unauthorized", statusCode: 403 };
  }

  const activeIndex = ORDER_STATUS_TIMELINE.indexOf(order.status);
  const timeline = ORDER_STATUS_TIMELINE.map((status, index) => ({
    status,
    done: activeIndex >= index,
    active: status === order.status,
  }));

  return {
    orderId: order._id,
    status: order.status,
    updatedAt: order.updatedAt,
    estimatedDelivery: order.status === "Delivered" || order.status === "Completed"
      ? order.updatedAt
      : null,
    timeline,
  };
};
