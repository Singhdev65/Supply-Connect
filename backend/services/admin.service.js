const mongoose = require("mongoose");
const {
  User,
  Product,
  Order,
  Payment,
  Review,
  ReturnRequest,
  Promotion,
  PayoutRequest,
  ActivityLog,
  CommissionRule,
  SupportTicket,
  CmsPage,
  MarketingBanner,
  Dispute,
  ProductTaxonomy,
} = require("../models");
const { USER_ROLES } = require("../config/roles");
const { logActivity } = require("./activityLog.service");

const INVOICE_PREFIX = "INV";

const ensureObjectId = (id, message = "Invalid id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw { message, statusCode: 400 };
};

const record = (req, payload) =>
  logActivity({
    ...payload,
    ip: req.ip || "",
    userAgent: req.headers?.["user-agent"] || "",
  });

const paginate = (query = {}) => {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
  return { page, limit, skip: (page - 1) * limit };
};

const generateTicketNo = () =>
  `TKT-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;

const generateInvoiceNo = (orderId) =>
  `${INVOICE_PREFIX}-${String(orderId).slice(-6).toUpperCase()}-${Date.now().toString().slice(-5)}`;

exports.adminLogin = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw { message: "Invalid credentials", statusCode: 401 };

  const match = await user.comparePassword(password);
  if (!match) throw { message: "Invalid credentials", statusCode: 401 };

  if (![USER_ROLES.ADMIN, USER_ROLES.OPS_MANAGER, USER_ROLES.SUPPORT, USER_ROLES.FINANCE].includes(user.role)) {
    throw { message: "Not an admin account", statusCode: 403 };
  }

  user.lastLoginAt = new Date();
  user.loginCount = Number(user.loginCount || 0) + 1;
  await user.save();

  const jwt = require("jsonwebtoken");
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminSubRole: user.adminSubRole || "none",
      adminPermissions: user.adminPermissions || [],
    },
  };
};

exports.listUsers = async (query = {}) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query.status === "blocked") filter.isBlocked = true;
  if (query.status === "suspended") filter.isSuspended = true;
  if (query.verificationStatus) filter.verificationStatus = query.verificationStatus;
  if (query.sellerStatus) filter.sellerStatus = query.sellerStatus;

  const [data, total] = await Promise.all([
    User.find(filter)
      .select("-password -resetPasswordTokenHash")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasMore: skip + data.length < total,
    },
  };
};

exports.updateUserStatus = async (userId, payload, admin, req) => {
  ensureObjectId(userId, "Invalid user id");
  const user = await User.findById(userId);
  if (!user) throw { message: "User not found", statusCode: 404 };

  if (payload.isBlocked !== undefined) user.isBlocked = Boolean(payload.isBlocked);
  if (payload.isSuspended !== undefined) user.isSuspended = Boolean(payload.isSuspended);
  if (payload.suspensionReason !== undefined) user.suspensionReason = payload.suspensionReason || "";
  if (payload.verificationStatus) user.verificationStatus = payload.verificationStatus;

  await user.save();
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "users",
    action: "update_status",
    targetType: "User",
    targetId: user._id,
    metadata: payload,
  });

  return user;
};

exports.resetUserPassword = async (userId, newPassword, admin, req) => {
  ensureObjectId(userId, "Invalid user id");
  const user = await User.findById(userId);
  if (!user) throw { message: "User not found", statusCode: 404 };

  user.password = newPassword;
  user.resetPasswordTokenHash = "";
  user.resetPasswordExpiresAt = null;
  await user.save();

  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "users",
    action: "reset_password",
    targetType: "User",
    targetId: user._id,
  });
  return { success: true };
};

exports.getUserActivityLogs = async (userId, query = {}) => {
  ensureObjectId(userId, "Invalid user id");
  const { page, limit, skip } = paginate(query);

  const [data, total] = await Promise.all([
    ActivityLog.find({
      $or: [{ actor: userId }, { targetType: "User", targetId: String(userId) }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ActivityLog.countDocuments({
      $or: [{ actor: userId }, { targetType: "User", targetId: String(userId) }],
    }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasMore: skip + data.length < total,
    },
  };
};

exports.listActivityLogs = async (query = {}) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.module) filter.module = query.module;
  if (query.action) filter.action = query.action;
  if (query.actorId && mongoose.Types.ObjectId.isValid(query.actorId)) filter.actor = query.actorId;

  const [data, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ActivityLog.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasMore: skip + data.length < total,
    },
  };
};

exports.updateAdminPermissions = async (userId, payload, admin, req) => {
  ensureObjectId(userId, "Invalid user id");
  const user = await User.findById(userId);
  if (!user) throw { message: "User not found", statusCode: 404 };

  if (![USER_ROLES.ADMIN, USER_ROLES.OPS_MANAGER, USER_ROLES.SUPPORT, USER_ROLES.FINANCE].includes(user.role)) {
    throw { message: "Target user is not an admin account", statusCode: 400 };
  }

  user.adminSubRole = payload.adminSubRole;
  user.adminPermissions = payload.adminPermissions || [];
  await user.save();

  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "admins",
    action: "update_permissions",
    targetType: "User",
    targetId: user._id,
    metadata: payload,
  });
  return user;
};

exports.listPendingSellers = () =>
  User.find({ role: USER_ROLES.VENDOR, sellerStatus: "pending" }).select(
    "-password -resetPasswordTokenHash",
  );

exports.updateSellerApproval = async (sellerId, payload, admin, req) => {
  ensureObjectId(sellerId, "Invalid seller id");
  const seller = await User.findOne({ _id: sellerId, role: USER_ROLES.VENDOR });
  if (!seller) throw { message: "Seller not found", statusCode: 404 };

  seller.sellerStatus = payload.sellerStatus;
  if (payload.sellerStatus === "approved") {
    seller.verificationStatus = "verified";
    seller.isSuspended = false;
  } else if (payload.sellerStatus === "rejected") {
    seller.verificationStatus = "rejected";
    seller.suspensionReason = payload.reason || "";
  } else if (payload.sellerStatus === "suspended") {
    seller.isSuspended = true;
    seller.suspensionReason = payload.reason || "Seller suspended by admin";
  }

  await seller.save();
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "sellers",
    action: "approval_update",
    targetType: "User",
    targetId: seller._id,
    metadata: payload,
  });
  return seller;
};

exports.updateSellerCommercials = async (sellerId, payload, admin, req) => {
  ensureObjectId(sellerId, "Invalid seller id");
  const seller = await User.findOne({ _id: sellerId, role: USER_ROLES.VENDOR });
  if (!seller) throw { message: "Seller not found", statusCode: 404 };

  if (payload.sellerCommissionRate !== undefined) seller.sellerCommissionRate = payload.sellerCommissionRate;
  if (payload.sellerSubscriptionPlan !== undefined) seller.sellerSubscriptionPlan = payload.sellerSubscriptionPlan;
  await seller.save();
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "sellers",
    action: "commercials_update",
    targetType: "User",
    targetId: seller._id,
    metadata: payload,
  });
  return seller;
};

exports.getSellerPerformance = async (query = {}) => {
  const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
  return Order.aggregate([
    { $match: { status: { $in: ["Delivered", "Completed", "Refunded"] } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.vendor",
        grossSales: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
        unitsSold: { $sum: "$items.qty" },
        totalOrders: { $addToSet: "$_id" },
      },
    },
    {
      $project: {
        sellerId: "$_id",
        grossSales: 1,
        unitsSold: 1,
        totalOrders: { $size: "$totalOrders" },
      },
    },
    { $sort: { grossSales: -1 } },
    { $limit: limit },
  ]);
};

exports.getSellerRatingsOverview = () =>
  Product.aggregate([
    { $match: { vendor: { $ne: null } } },
    {
      $group: {
        _id: "$vendor",
        productCount: { $sum: 1 },
        ratingAverage: { $avg: "$ratingAverage" },
        ratingCount: { $sum: "$ratingCount" },
      },
    },
    { $sort: { ratingAverage: -1, ratingCount: -1 } },
  ]);

exports.listSellerPayouts = async (query = {}) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.vendorId && mongoose.Types.ObjectId.isValid(query.vendorId)) filter.vendor = query.vendorId;
  const [data, total] = await Promise.all([
    PayoutRequest.find(filter).populate("vendor", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
    PayoutRequest.countDocuments(filter),
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), hasMore: skip + data.length < total },
  };
};

exports.updateSellerPayoutStatus = async (payoutId, payload, admin, req) => {
  ensureObjectId(payoutId, "Invalid payout id");
  const payout = await PayoutRequest.findById(payoutId);
  if (!payout) throw { message: "Payout not found", statusCode: 404 };

  payout.status = payload.status || payout.status;
  payout.processedNote = payload.processedNote || payout.processedNote;
  payout.processedAt = new Date();
  if (payload.transactionRef) payout.transactionRef = payload.transactionRef;
  await payout.save();

  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "sellers",
    action: "payout_update",
    targetType: "PayoutRequest",
    targetId: payout._id,
    metadata: payload,
  });
  return payout;
};

exports.listProductsForModeration = async (query = {}) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.moderationStatus) filter.moderationStatus = query.moderationStatus;
  if (query.vendorId && mongoose.Types.ObjectId.isValid(query.vendorId)) filter.vendor = query.vendorId;
  const [data, total] = await Promise.all([
    Product.find(filter).populate("vendor", "name email sellerStatus").sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), hasMore: skip + data.length < total },
  };
};

exports.moderateProduct = async (productId, payload, admin, req) => {
  ensureObjectId(productId, "Invalid product id");
  const product = await Product.findById(productId);
  if (!product) throw { message: "Product not found", statusCode: 404 };

  product.moderationStatus = payload.moderationStatus;
  product.moderationNotes = payload.moderationNotes || "";
  product.isPublished = payload.moderationStatus === "approved";
  if (payload.moderationStatus === "approved") {
    product.approvedBy = admin.id;
    product.approvedAt = new Date();
  }
  await product.save();

  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "products",
    action: "moderate",
    targetType: "Product",
    targetId: product._id,
    metadata: payload,
  });
  return product;
};

exports.bulkImportProducts = async (products = [], admin, req) => {
  const created = [];
  for (const row of products) {
    ensureObjectId(row.vendor, "Invalid vendor id in bulk import");
    const doc = await Product.create({
      ...row,
      moderationStatus: "approved",
      approvedBy: admin.id,
      approvedAt: new Date(),
      isPublished: true,
      searchKeywords: [
        ...(row.name ? String(row.name).toLowerCase().split(/\s+/) : []),
        ...(row.tags || []),
      ],
    });
    created.push(doc);
  }
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "products",
    action: "bulk_import",
    targetType: "Product",
    metadata: { count: created.length },
  });
  return { count: created.length, ids: created.map((item) => item._id) };
};

exports.bulkExportProducts = async (query = {}) => {
  const filter = {};
  if (query.vendorId && mongoose.Types.ObjectId.isValid(query.vendorId)) filter.vendor = query.vendorId;
  if (query.category) filter.category = query.category;
  if (query.moderationStatus) filter.moderationStatus = query.moderationStatus;
  return Product.find(filter).populate("vendor", "name email").sort({ createdAt: -1 });
};

exports.updateProductTags = async (productId, tags, admin, req) => {
  ensureObjectId(productId, "Invalid product id");
  const product = await Product.findById(productId);
  if (!product) throw { message: "Product not found", statusCode: 404 };
  product.tags = tags || [];
  product.searchKeywords = [
    ...new Set([
      ...(String(product.name || "").toLowerCase().split(/\s+/)),
      ...(product.tags || []).map((tag) => String(tag).toLowerCase()),
      String(product.category || "").toLowerCase(),
      String(product.subcategory || "").toLowerCase(),
    ].filter(Boolean)),
  ];
  await product.save();
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "products",
    action: "update_tags",
    targetType: "Product",
    targetId: product._id,
    metadata: { tagCount: product.tags.length },
  });
  return product;
};

exports.reindexProducts = async (admin, req) => {
  const cursor = Product.find({}).cursor();
  let updated = 0;
  for await (const product of cursor) {
    const nextKeywords = [
      ...new Set([
        ...(String(product.name || "").toLowerCase().split(/\s+/)),
        ...(String(product.description || "").toLowerCase().split(/\s+/)),
        ...(product.tags || []).map((tag) => String(tag).toLowerCase()),
        String(product.category || "").toLowerCase(),
        String(product.subcategory || "").toLowerCase(),
      ].filter((token) => token && token.length > 1)),
    ];
    product.searchKeywords = nextKeywords;
    await product.save();
    updated += 1;
  }
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "products",
    action: "reindex",
    metadata: { updated },
  });
  return { updated };
};

exports.getInventoryMonitoring = async () =>
  Product.aggregate([
    {
      $facet: {
        lowStock: [{ $match: { stock: { $lte: 10 } } }, { $count: "count" }],
        outOfStock: [{ $match: { stock: { $lte: 0 } } }, { $count: "count" }],
        total: [{ $count: "count" }],
      },
    },
  ]).then((rows) => rows[0] || {});

exports.getTaxonomy = async () => {
  const docs = await ProductTaxonomy.find({});
  return docs.reduce((acc, doc) => ({ ...acc, [doc.key]: doc.value }), {});
};

exports.upsertTaxonomy = async (key, value, admin, req) => {
  const doc = await ProductTaxonomy.findOneAndUpdate(
    { key },
    { key, value, updatedBy: admin.id },
    { upsert: true, new: true },
  );
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "products",
    action: "taxonomy_upsert",
    targetType: "ProductTaxonomy",
    targetId: doc._id,
    metadata: { key },
  });
  return doc;
};

exports.listOrders = async (query = {}) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.buyerId && mongoose.Types.ObjectId.isValid(query.buyerId)) filter.buyer = query.buyerId;
  if (query.vendorId && mongoose.Types.ObjectId.isValid(query.vendorId)) filter["items.vendor"] = query.vendorId;
  const [data, total] = await Promise.all([
    Order.find(filter)
      .populate("buyer", "name email")
      .populate("items.product", "name images vendor price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), hasMore: skip + data.length < total },
  };
};

exports.modifyOrder = async (orderId, payload, admin, req) => {
  ensureObjectId(orderId, "Invalid order id");
  const order = await Order.findById(orderId);
  if (!order) throw { message: "Order not found", statusCode: 404 };
  if (payload.status) order.status = payload.status;
  if (payload.deliveryNotes !== undefined) order.deliveryNotes = payload.deliveryNotes;
  await order.save();
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "orders",
    action: "modify",
    targetType: "Order",
    targetId: order._id,
    metadata: payload,
  });
  return order;
};

exports.approveRefund = async (orderId, payload, admin, req) => {
  ensureObjectId(orderId, "Invalid order id");
  const order = await Order.findById(orderId);
  if (!order) throw { message: "Order not found", statusCode: 404 };

  const refundAmount = Number(payload.amount || 0);
  if (refundAmount < 0) throw { message: "Invalid refund amount", statusCode: 400 };
  if (refundAmount > Number(order.totalAmount || 0)) {
    throw { message: "Refund amount exceeds order total", statusCode: 400 };
  }

  order.status = "Refunded";
  order.escrowStatus = "refunded";
  order.deliveryNotes = payload.reason ? `${order.deliveryNotes || ""} | Refund: ${payload.reason}`.trim() : order.deliveryNotes;
  await order.save();

  await Payment.create({
    order: order._id,
    buyer: order.buyer,
    amount: refundAmount,
    method: "RAZORPAY",
    status: "Paid",
    providerOrderId: "",
    providerPaymentId: `refund_${Date.now()}`,
  });

  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "orders",
    action: "refund_approve",
    targetType: "Order",
    targetId: order._id,
    metadata: payload,
  });
  return { success: true, orderId: order._id, refundAmount };
};

exports.cancelOrder = async (orderId, reason, admin, req) => {
  ensureObjectId(orderId, "Invalid order id");
  const order = await Order.findById(orderId);
  if (!order) throw { message: "Order not found", statusCode: 404 };
  order.status = "Cancelled";
  order.deliveryNotes = reason ? `${order.deliveryNotes || ""} | Admin cancel: ${reason}`.trim() : order.deliveryNotes;
  await order.save();
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "orders",
    action: "cancel",
    targetType: "Order",
    targetId: order._id,
    metadata: { reason },
  });
  return order;
};

exports.getShipmentTrackingOverview = async () =>
  Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

exports.listReturns = async (query = {}) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  const [data, total] = await Promise.all([
    ReturnRequest.find(filter)
      .populate("buyer", "name email")
      .populate("vendor", "name email")
      .populate("order", "status createdAt totalAmount")
      .populate("product", "name images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ReturnRequest.countDocuments(filter),
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), hasMore: skip + data.length < total },
  };
};

exports.updateReturn = async (returnId, payload, admin, req) => {
  ensureObjectId(returnId, "Invalid return id");
  const item = await ReturnRequest.findById(returnId);
  if (!item) throw { message: "Return request not found", statusCode: 404 };
  if (payload.status) item.status = payload.status;
  if (payload.refundStatus) item.refundStatus = payload.refundStatus;
  if (payload.vendorNote !== undefined) item.vendorNote = payload.vendorNote;
  item.history.push({
    status: item.status,
    note: payload.vendorNote || "",
    byRole: "system",
    createdAt: new Date(),
  });
  await item.save();
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "returns",
    action: "update",
    targetType: "ReturnRequest",
    targetId: item._id,
    metadata: payload,
  });
  return item;
};

exports.listCommissionRules = () => CommissionRule.find({}).sort({ createdAt: -1 });

exports.createCommissionRule = async (payload, admin, req) => {
  if (payload.seller) ensureObjectId(payload.seller, "Invalid seller id");
  const row = await CommissionRule.create(payload);
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "commissions",
    action: "create_rule",
    targetType: "CommissionRule",
    targetId: row._id,
    metadata: payload,
  });
  return row;
};

exports.updateCommissionRule = async (ruleId, payload, admin, req) => {
  ensureObjectId(ruleId, "Invalid commission rule id");
  const row = await CommissionRule.findById(ruleId);
  if (!row) throw { message: "Commission rule not found", statusCode: 404 };
  Object.assign(row, payload);
  await row.save();
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "commissions",
    action: "update_rule",
    targetType: "CommissionRule",
    targetId: row._id,
    metadata: payload,
  });
  return row;
};

exports.getFinanceOverview = async () => {
  const [payments, payouts, orders] = await Promise.all([
    Payment.aggregate([{ $group: { _id: "$status", amount: { $sum: "$amount" }, count: { $sum: 1 } } }]),
    PayoutRequest.aggregate([{ $group: { _id: "$status", amount: { $sum: "$amount" }, count: { $sum: 1 } } }]),
    Order.aggregate([{ $group: { _id: "$status", total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }]),
  ]);

  return { payments, payouts, orders };
};

exports.generateInvoice = async (orderId, admin, req) => {
  ensureObjectId(orderId, "Invalid order id");
  const order = await Order.findById(orderId).populate("buyer", "name email").populate("items.product", "name");
  if (!order) throw { message: "Order not found", statusCode: 404 };

  const invoiceNo = order.invoiceNo || generateInvoiceNo(order._id);
  if (!order.invoiceNo) {
    order.invoiceNo = invoiceNo;
    await order.save();
  }

  const invoice = {
    invoiceNo,
    generatedAt: new Date(),
    orderId: order._id,
    buyer: order.buyer,
    items: order.items.map((item) => ({
      product: item.product?.name || item.name,
      qty: item.qty,
      unitPrice: item.price,
      lineTotal: Number(item.qty || 0) * Number(item.price || 0),
    })),
    subtotal: order.subtotalAmount || order.totalAmount,
    discount: order.discountAmount || 0,
    total: order.totalAmount,
    tax: Number(((order.totalAmount || 0) * 0.18).toFixed(2)),
  };

  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "finance",
    action: "generate_invoice",
    targetType: "Order",
    targetId: order._id,
  });
  return invoice;
};

exports.getAnalyticsOverview = async () => {
  const [sales, products, sellers, buyers, conversion] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $in: ["Delivered", "Completed"] } } },
      { $group: { _id: null, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
    ]),
    Product.aggregate([
      { $group: { _id: "$category", productCount: { $sum: 1 }, avgRating: { $avg: "$ratingAverage" } } },
      { $sort: { productCount: -1 } },
    ]),
    User.countDocuments({ role: USER_ROLES.VENDOR }),
    User.countDocuments({ role: USER_ROLES.BUYER }),
    Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  return {
    sales: sales[0] || { revenue: 0, orders: 0 },
    productPerformance: products,
    sellerCount: sellers,
    buyerCount: buyers,
    conversion,
  };
};

exports.exportReport = async () => {
  const analytics = await exports.getAnalyticsOverview();
  const finance = await exports.getFinanceOverview();
  return {
    generatedAt: new Date(),
    analytics,
    finance,
  };
};

exports.listPromotions = () => Promotion.find({}).populate("vendor", "name email").sort({ createdAt: -1 });

exports.upsertCmsPage = async (payload, admin, req) => {
  const doc = await CmsPage.findOneAndUpdate(
    { slug: payload.slug },
    {
      ...payload,
      publishedAt: payload.status === "published" ? new Date() : null,
      updatedBy: admin.id,
    },
    { upsert: true, new: true },
  );
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "cms",
    action: "upsert_page",
    targetType: "CmsPage",
    targetId: doc._id,
    metadata: { slug: payload.slug, status: payload.status },
  });
  return doc;
};

exports.listCmsPages = () => CmsPage.find({}).sort({ updatedAt: -1 });

exports.upsertBanner = async (payload, admin, req) => {
  let row = null;
  if (payload._id && mongoose.Types.ObjectId.isValid(payload._id)) {
    row = await MarketingBanner.findById(payload._id);
  }
  if (!row) row = new MarketingBanner();
  Object.assign(row, payload);
  row.updatedBy = admin.id;
  await row.save();
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "cms",
    action: "upsert_banner",
    targetType: "MarketingBanner",
    targetId: row._id,
    metadata: { placement: row.placement, isActive: row.isActive },
  });
  return row;
};

exports.listBanners = (placement = "") =>
  MarketingBanner.find(placement ? { placement } : {}).sort({ placement: 1, order: 1, createdAt: -1 });

exports.listReviewsForModeration = async (query = {}) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.moderationStatus) filter.moderationStatus = query.moderationStatus;
  if (query.abuseOnly === "true") filter.abuseReportCount = { $gt: 0 };
  const [data, total] = await Promise.all([
    Review.find(filter)
      .populate("product", "name images")
      .populate("reviewer", "name email")
      .populate("vendor", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), hasMore: skip + data.length < total },
  };
};

exports.moderateReview = async (reviewId, payload, admin, req) => {
  ensureObjectId(reviewId, "Invalid review id");
  const review = await Review.findById(reviewId);
  if (!review) throw { message: "Review not found", statusCode: 404 };
  if (payload.action === "remove") review.moderationStatus = "hidden";
  if (payload.action === "flag") review.moderationStatus = "flagged";
  if (payload.action === "restore") review.moderationStatus = "visible";
  review.moderationReason = payload.reason || "";
  await review.save();
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "reviews",
    action: "moderate",
    targetType: "Review",
    targetId: review._id,
    metadata: payload,
  });
  return review;
};

exports.createSupportTicket = async (payload, actor, req) => {
  const ticket = await SupportTicket.create({
    ticketNo: generateTicketNo(),
    createdBy: actor.id,
    subject: payload.subject,
    description: payload.description,
    category: payload.category || "general",
    priority: payload.priority || "medium",
    relatedOrder: payload.relatedOrder || null,
    messages: [
      {
        sender: actor.id,
        senderRole: actor.role,
        message: payload.description,
        attachments: [],
      },
    ],
  });
  await record(req, {
    actor: actor.id,
    actorRole: actor.role,
    module: "support",
    action: "create_ticket",
    targetType: "SupportTicket",
    targetId: ticket._id,
    metadata: { category: ticket.category, priority: ticket.priority },
  });
  return ticket;
};

exports.listSupportTickets = async (query = {}) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.createdBy && mongoose.Types.ObjectId.isValid(query.createdBy)) filter.createdBy = query.createdBy;

  const [data, total] = await Promise.all([
    SupportTicket.find(filter)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    SupportTicket.countDocuments(filter),
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), hasMore: skip + data.length < total },
  };
};

exports.replySupportTicket = async (ticketId, payload, actor, req) => {
  ensureObjectId(ticketId, "Invalid ticket id");
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket) throw { message: "Ticket not found", statusCode: 404 };

  ticket.messages.push({
    sender: actor.id,
    senderRole: actor.role,
    message: payload.message,
    attachments: [],
  });
  if (payload.status) ticket.status = payload.status;
  if (payload.assignedTo && mongoose.Types.ObjectId.isValid(payload.assignedTo)) ticket.assignedTo = payload.assignedTo;
  await ticket.save();

  await record(req, {
    actor: actor.id,
    actorRole: actor.role,
    module: "support",
    action: "reply_ticket",
    targetType: "SupportTicket",
    targetId: ticket._id,
    metadata: { status: ticket.status },
  });
  return ticket;
};

exports.createDispute = async (payload, actor, req) => {
  const row = await Dispute.create({
    raisedBy: payload.raisedBy || actor.id,
    againstUser: payload.againstUser || null,
    order: payload.order || null,
    returnRequest: payload.returnRequest || null,
    type: payload.type || "other",
    summary: payload.summary,
    details: payload.details || "",
  });
  await record(req, {
    actor: actor.id,
    actorRole: actor.role,
    module: "disputes",
    action: "create",
    targetType: "Dispute",
    targetId: row._id,
    metadata: { type: row.type },
  });
  return row;
};

exports.listDisputes = async (query = {}) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.type) filter.type = query.type;
  const [data, total] = await Promise.all([
    Dispute.find(filter)
      .populate("raisedBy", "name email role")
      .populate("againstUser", "name email role")
      .populate("order", "status totalAmount")
      .populate("returnRequest", "status refundStatus")
      .populate("handledBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Dispute.countDocuments(filter),
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), hasMore: skip + data.length < total },
  };
};

exports.resolveDispute = async (disputeId, payload, admin, req) => {
  ensureObjectId(disputeId, "Invalid dispute id");
  const row = await Dispute.findById(disputeId);
  if (!row) throw { message: "Dispute not found", statusCode: 404 };
  row.status = payload.status;
  row.resolution = payload.resolution || row.resolution;
  row.handledBy = admin.id;
  await row.save();
  await record(req, {
    actor: admin.id,
    actorRole: admin.role,
    module: "disputes",
    action: "resolve",
    targetType: "Dispute",
    targetId: row._id,
    metadata: payload,
  });
  return row;
};
