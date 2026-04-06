const mongoose = require("mongoose");
const {
  returnRepository,
  orderRepository,
} = require("../repositories");

const VALID_COMPLETION_STATUSES = ["Delivered", "Completed"];

exports.createRequest = async (payload, authUser) => {
  const { orderId, productId, reason, requestedAction = "refund", evidenceImages = [] } = payload;
  if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(productId)) {
    throw { message: "Invalid order or product id", statusCode: 400 };
  }

  const order = await orderRepository.findByIdWithRelations(orderId);
  if (!order) throw { message: "Order not found", statusCode: 404 };
  if (String(order.buyer?._id || order.buyer) !== String(authUser.id)) {
    throw { message: "Unauthorized", statusCode: 403 };
  }

  if (!VALID_COMPLETION_STATUSES.includes(order.status)) {
    throw { message: "Return can only be requested after delivery", statusCode: 400 };
  }

  const targetItem = (order.items || []).find(
    (item) => String(item.product?._id || item.product) === String(productId),
  );
  if (!targetItem) {
    throw { message: "Product not found in this order", statusCode: 400 };
  }

  const existing = await returnRepository.findByComposite({
    orderId,
    productId,
    buyerId: authUser.id,
  });
  if (existing) throw { message: "Return request already exists", statusCode: 409 };

  const amount = Number(targetItem.price || 0) * Number(targetItem.qty || 1);

  return returnRepository.create({
    order: orderId,
    product: productId,
    buyer: authUser.id,
    vendor: targetItem.vendor,
    reason,
    requestedAction,
    evidenceImages,
    amount,
    refundStatus: requestedAction === "refund" ? "pending" : "not_applicable",
    history: [
      {
        status: "requested",
        note: reason,
        byRole: "buyer",
      },
    ],
  });
};

exports.getBuyerRequests = (authUser) => returnRepository.findByBuyer(authUser.id);

exports.getVendorRequests = (authUser) => returnRepository.findByVendor(authUser.id);

exports.updateVendorStatus = async (returnId, payload, authUser) => {
  const item = await returnRepository.findById(returnId);
  if (!item) throw { message: "Return request not found", statusCode: 404 };
  if (String(item.vendor?._id || item.vendor) !== String(authUser.id)) {
    throw { message: "Unauthorized", statusCode: 403 };
  }

  item.status = payload.status;
  if (payload.vendorNote !== undefined) item.vendorNote = payload.vendorNote;
  if (payload.refundStatus) item.refundStatus = payload.refundStatus;
  item.history.push({
    status: payload.status,
    note: payload.vendorNote || "",
    byRole: "vendor",
  });

  return returnRepository.save(item);
};
