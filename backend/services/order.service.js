const { orderRepository, productRepository } = require("../repositories");

exports.placeOrder = async (items, user) => {
  if (!items?.length) throw { message: "Cart is empty", statusCode: 400 };

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
    status: "Pending Payment",
  });
};

exports.getOrders = (user) => {
  if (user.role === "buyer") return orderRepository.findByBuyer(user.id);

  return orderRepository.findAll();
};
