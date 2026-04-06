const mongoose = require("mongoose");
const { userRepository, productRepository } = require("../repositories");

const MAX_RECENTLY_VIEWED_ITEMS = 20;

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  avatarUrl: user.avatarUrl || "",
  bio: user.bio || "",
  addresses: (user.addresses || []).map((address) => ({
    id: address._id,
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
    isDefault: Boolean(address.isDefault),
    createdAt: address.createdAt,
    updatedAt: address.updatedAt,
  })),
  wishlist: (user.wishlist || []).map((product) => ({
    _id: product._id || product,
    name: product.name,
    price: product.price,
    stock: product.stock,
    images: product.images || [],
    category: product.category,
    subcategory: product.subcategory,
    vendor: product.vendor,
    ratingAverage: product.ratingAverage,
    ratingCount: product.ratingCount,
    createdAt: product.createdAt,
  })),
  recentlyViewed: (user.recentlyViewed || []).map((entry) => ({
    product: entry.product?._id || entry.product,
    viewedAt: entry.viewedAt,
    details: entry.product?._id
      ? {
          _id: entry.product._id,
          name: entry.product.name,
          price: entry.product.price,
          stock: entry.product.stock,
          images: entry.product.images || [],
          category: entry.product.category,
          subcategory: entry.product.subcategory,
          vendor: entry.product.vendor,
          ratingAverage: entry.product.ratingAverage,
          ratingCount: entry.product.ratingCount,
        }
      : null,
  })),
  sellerProfile: {
    storeName: user.sellerProfile?.storeName || "",
    storeDescription: user.sellerProfile?.storeDescription || "",
    storeLogo: user.sellerProfile?.storeLogo || "",
    storeBanner: user.sellerProfile?.storeBanner || "",
    brandingColor: user.sellerProfile?.brandingColor || "",
    policies: user.sellerProfile?.policies || "",
    seoTitle: user.sellerProfile?.seoTitle || "",
    seoDescription: user.sellerProfile?.seoDescription || "",
    kycStatus: user.sellerProfile?.kycStatus || "not_submitted",
    kycDocumentUrl: user.sellerProfile?.kycDocumentUrl || "",
    kycRejectedReason: user.sellerProfile?.kycRejectedReason || "",
  },
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getUserOrThrow = async (userId) => {
  const user = await userRepository
    .findById(userId)
    .populate("wishlist", "name images price stock category subcategory vendor ratingAverage ratingCount createdAt")
    .populate("recentlyViewed.product", "name images price stock category subcategory vendor ratingAverage ratingCount");
  if (!user) throw { message: "User not found", statusCode: 404 };
  return user;
};

const ensureDefaultAddress = (user) => {
  if (!user.addresses?.length) return;

  const hasDefault = user.addresses.some((address) => address.isDefault);
  if (hasDefault) return;

  user.addresses[0].isDefault = true;
};

exports.getMyProfile = async (authUser) => {
  const user = await getUserOrThrow(authUser.id);
  ensureDefaultAddress(user);
  if (user.isModified()) await userRepository.save(user);
  return sanitizeUser(user);
};

exports.updateMyProfile = async (authUser, payload) => {
  const user = await getUserOrThrow(authUser.id);

  user.name = payload.name;
  user.phone = payload.phone || "";
  user.avatarUrl = payload.avatarUrl || "";
  user.bio = payload.bio || "";

  const updated = await userRepository.save(user);
  return sanitizeUser(updated);
};

exports.addAddress = async (authUser, payload) => {
  const user = await getUserOrThrow(authUser.id);
  const nextAddress = {
    ...payload,
    label: payload.label || "",
    line2: payload.line2 || "",
    landmark: payload.landmark || "",
  };

  if (!user.addresses.length || payload.isDefault) {
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
    nextAddress.isDefault = true;
  }

  user.addresses.push(nextAddress);
  const updated = await userRepository.save(user);
  return sanitizeUser(updated);
};

exports.updateAddress = async (authUser, addressId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw { message: "Invalid address id", statusCode: 400 };
  }

  const user = await getUserOrThrow(authUser.id);
  const address = user.addresses.id(addressId);
  if (!address) throw { message: "Address not found", statusCode: 404 };

  Object.assign(address, {
    label: payload.label || "",
    recipientName: payload.recipientName,
    phone: payload.phone,
    line1: payload.line1,
    line2: payload.line2 || "",
    landmark: payload.landmark || "",
    city: payload.city,
    state: payload.state,
    postalCode: payload.postalCode,
    country: payload.country,
  });

  if (payload.isDefault) {
    user.addresses.forEach((entry) => {
      entry.isDefault = String(entry._id) === String(address._id);
    });
  }

  ensureDefaultAddress(user);
  const updated = await userRepository.save(user);
  return sanitizeUser(updated);
};

exports.deleteAddress = async (authUser, addressId) => {
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw { message: "Invalid address id", statusCode: 400 };
  }

  const user = await getUserOrThrow(authUser.id);
  const address = user.addresses.id(addressId);
  if (!address) throw { message: "Address not found", statusCode: 404 };

  address.deleteOne();
  ensureDefaultAddress(user);

  const updated = await userRepository.save(user);
  return sanitizeUser(updated);
};

exports.setDefaultAddress = async (authUser, addressId) => {
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw { message: "Invalid address id", statusCode: 400 };
  }

  const user = await getUserOrThrow(authUser.id);
  const target = user.addresses.id(addressId);
  if (!target) throw { message: "Address not found", statusCode: 404 };

  user.addresses.forEach((address) => {
    address.isDefault = String(address._id) === String(addressId);
  });

  const updated = await userRepository.save(user);
  return sanitizeUser(updated);
};

exports.getWishlist = async (authUser) => {
  const user = await getUserOrThrow(authUser.id);
  return sanitizeUser(user).wishlist;
};

exports.addToWishlist = async (authUser, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw { message: "Invalid product id", statusCode: 400 };
  }

  const product = await productRepository.findById(productId);
  if (!product || !product.isPublished) {
    throw { message: "Product not found", statusCode: 404 };
  }

  const user = await userRepository.findById(authUser.id);
  if (!user) throw { message: "User not found", statusCode: 404 };

  const exists = (user.wishlist || []).some(
    (id) => String(id) === String(productId),
  );
  if (!exists) {
    user.wishlist.push(productId);
    await userRepository.save(user);
  }

  const hydrated = await getUserOrThrow(authUser.id);
  return sanitizeUser(hydrated).wishlist;
};

exports.removeFromWishlist = async (authUser, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw { message: "Invalid product id", statusCode: 400 };
  }

  const user = await userRepository.findById(authUser.id);
  if (!user) throw { message: "User not found", statusCode: 404 };

  user.wishlist = (user.wishlist || []).filter(
    (id) => String(id) !== String(productId),
  );
  await userRepository.save(user);

  const hydrated = await getUserOrThrow(authUser.id);
  return sanitizeUser(hydrated).wishlist;
};

exports.getRecentlyViewed = async (authUser) => {
  const user = await getUserOrThrow(authUser.id);
  return sanitizeUser(user).recentlyViewed;
};

exports.markRecentlyViewed = async (authUser, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw { message: "Invalid product id", statusCode: 400 };
  }

  const product = await productRepository.findById(productId);
  if (!product || !product.isPublished) {
    throw { message: "Product not found", statusCode: 404 };
  }

  const user = await userRepository.findById(authUser.id);
  if (!user) throw { message: "User not found", statusCode: 404 };

  user.recentlyViewed = (user.recentlyViewed || []).filter(
    (entry) => String(entry.product) !== String(productId),
  );

  user.recentlyViewed.unshift({
    product: productId,
    viewedAt: new Date(),
  });

  if (user.recentlyViewed.length > MAX_RECENTLY_VIEWED_ITEMS) {
    user.recentlyViewed = user.recentlyViewed.slice(0, MAX_RECENTLY_VIEWED_ITEMS);
  }

  await userRepository.save(user);
  const hydrated = await getUserOrThrow(authUser.id);
  return sanitizeUser(hydrated).recentlyViewed;
};

exports.getSellerProfile = async (authUser) => {
  const user = await getUserOrThrow(authUser.id);
  return sanitizeUser(user).sellerProfile;
};

exports.updateSellerProfile = async (authUser, payload) => {
  const user = await userRepository.findById(authUser.id);
  if (!user) throw { message: "User not found", statusCode: 404 };

  const current = user.sellerProfile || {};
  const next = {
    ...current.toObject?.(),
    ...payload,
  };

  if (payload.kycDocumentUrl && current.kycStatus !== "verified") {
    next.kycStatus = "pending";
    next.kycRejectedReason = "";
  }

  user.sellerProfile = next;
  const updated = await userRepository.save(user);
  return sanitizeUser(updated).sellerProfile;
};
