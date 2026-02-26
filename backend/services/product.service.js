const { productRepository } = require("../repositories");
const {
  PRODUCT_CATEGORIES,
  isValidSubcategoryForCategory,
} = require("../config/productCatalog");

const toValidBannerImages = (images = [], bannerImages = []) => {
  const validImages = Array.isArray(images) ? images : [];
  const requested = Array.isArray(bannerImages) ? bannerImages : [];
  const filtered = requested.filter((url) => validImages.includes(url));

  if (filtered.length) return filtered;
  return validImages[0] ? [validImages[0]] : [];
};

exports.getProducts = async (user, query = {}) => {
  const page = Number(query.page || 0);
  const requestedLimit = Number(query.limit || 0);
  const limit = requestedLimit > 0 ? Math.min(Math.max(requestedLimit, 1), 100) : 20;
  const usePagination = Number.isFinite(page) && page > 0 && Number.isFinite(limit) && limit > 0;

  if (!usePagination) {
    if (user?.role === "vendor")
      return productRepository.findVendorProducts(user.id);

    return productRepository.findPublishedProducts();
  }

  if (user?.role === "vendor") {
    const { data, total } = await productRepository.findVendorProductsPaginated(user.id, {
      page,
      limit,
    });
    const totalPages = Math.ceil(total / limit);
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
  }

  const { data, total } = await productRepository.findPublishedProductsPaginated({
    page,
    limit,
  });
  const totalPages = Math.ceil(total / limit);
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

exports.getProductCategories = () => PRODUCT_CATEGORIES;

exports.getProductById = async (id, user) => {
  const product = await productRepository.findByIdForViewer(id);
  if (!product) throw { message: "Product not found", statusCode: 404 };

  if (user?.role === "vendor") {
    if (!product.vendor?._id?.equals?.(user.id))
      throw { message: "Unauthorized", statusCode: 403 };
    return product;
  }

  if (!product.isPublished)
    throw { message: "Product not found", statusCode: 404 };

  return product;
};

exports.addProduct = async (data, user) => {
  if (!data.images || !data.images.length)
    throw { message: "At least one image is required", statusCode: 400 };
  if (!isValidSubcategoryForCategory(data.category, data.subcategory)) {
    throw { message: "Invalid subcategory for selected category", statusCode: 400 };
  }

  return productRepository.create({
    ...data,
    bannerImages: toValidBannerImages(data.images, data.bannerImages),
    vendor: user.id,
    isPublished: true,
  });
};

exports.updateProduct = async (id, data, user) => {
  const product = await productRepository.findById(id);
  if (!product) throw { message: "Product not found", statusCode: 404 };

  if (!product.vendor.equals(user.id))
    throw { message: "Unauthorized", statusCode: 403 };

  const nextCategory = data.category || product.category;
  const nextSubcategory = data.subcategory || product.subcategory;
  if (!isValidSubcategoryForCategory(nextCategory, nextSubcategory)) {
    throw { message: "Invalid subcategory for selected category", statusCode: 400 };
  }

  Object.assign(product, data);
  product.bannerImages = toValidBannerImages(product.images, product.bannerImages);
  return productRepository.save(product);
};

exports.deleteProduct = async (id, user) => {
  const product = await productRepository.findById(id);
  if (!product) throw { message: "Product not found", statusCode: 404 };

  if (!product.vendor.equals(user.id))
    throw { message: "Unauthorized", statusCode: 403 };

  return productRepository.delete(product);
};
