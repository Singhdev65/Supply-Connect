const { productRepository } = require("../repositories");

exports.getProducts = async (user) => {
  if (user?.role === "vendor")
    return productRepository.findVendorProducts(user.id);

  return productRepository.findPublishedProducts();
};

exports.addProduct = async (data, user) => {
  if (!data.images || !data.images.length)
    throw { message: "At least one image is required", statusCode: 400 };

  return productRepository.create({
    ...data,
    vendor: user.id,
    isPublished: true,
  });
};

exports.updateProduct = async (id, data, user) => {
  const product = await productRepository.findById(id);
  if (!product) throw { message: "Product not found", statusCode: 404 };

  if (!product.vendor.equals(user.id))
    throw { message: "Unauthorized", statusCode: 403 };

  Object.assign(product, data);
  return productRepository.save(product);
};

exports.deleteProduct = async (id, user) => {
  const product = await productRepository.findById(id);
  if (!product) throw { message: "Product not found", statusCode: 404 };

  if (!product.vendor.equals(user.id))
    throw { message: "Unauthorized", statusCode: 403 };

  return productRepository.delete(product);
};
