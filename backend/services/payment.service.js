const { paymentRepository, orderRepository } = require("../repositories");
const razorpay = require("../integrations/razorpay");
const { generateUPIQR } = require("../integrations/upi");

exports.createPayment = async (orderId, method, user) => {
  const order = await orderRepository.findById(orderId);

  if (!order) throw { message: "Order not found", statusCode: 404 };
  if (String(order.buyer) !== String(user.id)) {
    throw { message: "Forbidden", statusCode: 403 };
  }

  /* ---------- COD ---------- */
  if (method === "COD") {
    return paymentRepository.create({
      order: orderId,
      buyer: user.id,
      amount: order.totalAmount,
      method: "COD",
      status: "Pending",
    });
  }

  /* ---------- RAZORPAY ---------- */
  if (method === "RAZORPAY") {
    const rpOrder = await razorpay.createOrder(order.totalAmount);

    return paymentRepository.create({
      order: orderId,
      buyer: user.id,
      amount: order.totalAmount,
      method: "RAZORPAY",
      providerOrderId: rpOrder.id,
    });
  }

  /* ---------- UPI QR ---------- */
  if (method === "UPI") {
    const { qrImage, expiresAt } = generateUPIQR({
      amount: order.totalAmount,
      orderId,
    });

    return paymentRepository.create({
      order: orderId,
      buyer: user.id,
      amount: order.totalAmount,
      method: "UPI",
      qrImage,
      expiresAt,
    });
  }

  throw { message: "Invalid payment method", statusCode: 400 };
};

exports.verifyPayment = async (paymentId) => {
  const payment = await paymentRepository.findById(paymentId);

  if (!payment) throw { message: "Payment not found", statusCode: 404 };

  payment.status = "Paid";
  await payment.save();

  await orderRepository.update(payment.order, {
    status: "Paid",
  });

  return payment;
};

exports.confirmCOD = async (orderId, user) => {
  const order = await orderRepository.findById(orderId);
  if (!order) throw { message: "Order not found", statusCode: 404 };
  if (String(order.buyer) !== String(user.id)) {
    throw { message: "Forbidden", statusCode: 403 };
  }

  let payment = await paymentRepository.findByOrderAndMethod(orderId, "COD");

  if (!payment) {
    payment = await paymentRepository.create({
      order: orderId,
      buyer: user.id,
      amount: order.totalAmount,
      method: "COD",
      status: "Pending",
    });
  }

  await orderRepository.update(orderId, { status: "Pending Payment" });

  return payment;
};
