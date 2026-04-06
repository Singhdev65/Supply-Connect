const mongoose = require("mongoose");
const {
  promotionRepository,
  productRepository,
  orderRepository,
} = require("../repositories");

const nowInRange = (promotion, now = new Date()) =>
  promotion.isActive && promotion.startsAt <= now && promotion.endsAt >= now;

const normalizeCode = (code) => String(code || "").trim().toUpperCase();

const toLineItems = async (items = []) => {
  const ids = [...new Set(items.map((item) => String(item.product || "")).filter(Boolean))];
  const products = await productRepository.findByIds(ids);
  const map = new Map(products.map((product) => [String(product._id), product]));

  return items.map((item) => {
    const product = map.get(String(item.product));
    if (!product) {
      throw { message: "One or more products are invalid for promotion", statusCode: 400 };
    }

    const qty = Number(item.qty || 0);
    if (!Number.isFinite(qty) || qty < 1) {
      throw { message: "Invalid quantity in promotion validation", statusCode: 400 };
    }

    return {
      productId: product._id,
      vendor: product.vendor?._id || product.vendor,
      category: product.category,
      qty,
      price: Number(product.price || 0),
      lineTotal: Number(product.price || 0) * qty,
      productName: product.name,
    };
  });
};

const filterEligibleItems = (lineItems, promotion) => {
  const base = lineItems.filter(
    (item) => String(item.vendor) === String(promotion.vendor),
  );

  if (promotion.scope === "products" && promotion.productIds?.length) {
    const productIds = new Set((promotion.productIds || []).map((id) => String(id)));
    return base.filter((item) => productIds.has(String(item.productId)));
  }

  if (promotion.scope === "categories" && promotion.categories?.length) {
    const categories = new Set((promotion.categories || []).map((c) => String(c)));
    return base.filter((item) => categories.has(String(item.category)));
  }

  return base;
};

const computeDiscount = (eligibleSubtotal, promotion) => {
  let discount =
    promotion.discountType === "percentage"
      ? (eligibleSubtotal * Number(promotion.discountValue || 0)) / 100
      : Number(promotion.discountValue || 0);

  if (promotion.maxDiscount > 0) {
    discount = Math.min(discount, Number(promotion.maxDiscount));
  }

  discount = Math.min(discount, eligibleSubtotal);
  return Number(discount.toFixed(2));
};

const assertPromotionUsageLimits = async (promotion, buyerId) => {
  if (promotion.usageLimit > 0 && promotion.usedCount >= promotion.usageLimit) {
    throw { message: "Promotion usage limit reached", statusCode: 400 };
  }

  if (promotion.perUserLimit > 0) {
    const usedByBuyer = await orderRepository.countByPromotionAndBuyer(
      promotion._id,
      buyerId,
    );
    if (usedByBuyer >= promotion.perUserLimit) {
      throw { message: "Promotion already used maximum times", statusCode: 400 };
    }
  }
};

const evaluatePromotion = async ({ promotion, lineItems, buyerId }) => {
  if (!nowInRange(promotion)) {
    throw { message: "Promotion is not active", statusCode: 400 };
  }

  await assertPromotionUsageLimits(promotion, buyerId);

  const eligibleItems = filterEligibleItems(lineItems, promotion);
  if (!eligibleItems.length) {
    throw { message: "Promotion not applicable to selected products", statusCode: 400 };
  }

  const eligibleSubtotal = eligibleItems.reduce((sum, item) => sum + item.lineTotal, 0);
  if (eligibleSubtotal < Number(promotion.minOrderValue || 0)) {
    throw { message: "Minimum order value not met for this promotion", statusCode: 400 };
  }

  const discountAmount = computeDiscount(eligibleSubtotal, promotion);
  if (discountAmount <= 0) {
    throw { message: "Promotion does not yield a discount", statusCode: 400 };
  }

  return {
    promotionId: promotion._id,
    code: promotion.code,
    title: promotion.title,
    vendor: promotion.vendor,
    eligibleSubtotal: Number(eligibleSubtotal.toFixed(2)),
    discountType: promotion.discountType,
    discountValue: promotion.discountValue,
    discountAmount,
  };
};

exports.createPromotion = async (payload, authUser) => {
  const code = normalizeCode(payload.code);
  if (!code) throw { message: "Promotion code is required", statusCode: 400 };

  const existing = await promotionRepository.findByCode(code);
  if (existing) throw { message: "Promotion code already exists", statusCode: 409 };

  if (payload.scope === "products") {
    if (!payload.productIds?.length) {
      throw { message: "Select at least one product for product-scoped promotion", statusCode: 400 };
    }
    for (const id of payload.productIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw { message: "Invalid product id in promotion", statusCode: 400 };
      }
    }
  }

  return promotionRepository.create({
    ...payload,
    code,
    vendor: authUser.id,
  });
};

exports.listVendorPromotions = (authUser) => promotionRepository.findByVendor(authUser.id);

exports.updatePromotion = async (id, payload, authUser) => {
  const promotion = await promotionRepository.findById(id);
  if (!promotion) throw { message: "Promotion not found", statusCode: 404 };
  if (String(promotion.vendor) !== String(authUser.id)) {
    throw { message: "Unauthorized", statusCode: 403 };
  }

  if (payload.code && normalizeCode(payload.code) !== promotion.code) {
    const existing = await promotionRepository.findByCode(payload.code);
    if (existing && String(existing._id) !== String(promotion._id)) {
      throw { message: "Promotion code already exists", statusCode: 409 };
    }
  }

  Object.assign(promotion, {
    ...payload,
    ...(payload.code ? { code: normalizeCode(payload.code) } : {}),
  });

  return promotionRepository.save(promotion);
};

exports.togglePromotion = async (id, authUser) => {
  const promotion = await promotionRepository.findById(id);
  if (!promotion) throw { message: "Promotion not found", statusCode: 404 };
  if (String(promotion.vendor) !== String(authUser.id)) {
    throw { message: "Unauthorized", statusCode: 403 };
  }
  promotion.isActive = !promotion.isActive;
  return promotionRepository.save(promotion);
};

exports.deletePromotion = async (id, authUser) => {
  const promotion = await promotionRepository.findById(id);
  if (!promotion) throw { message: "Promotion not found", statusCode: 404 };
  if (String(promotion.vendor) !== String(authUser.id)) {
    throw { message: "Unauthorized", statusCode: 403 };
  }
  promotion.isActive = false;
  promotion.endsAt = new Date();
  return promotionRepository.save(promotion);
};

exports.listActiveDeals = () => promotionRepository.findActivePublic(new Date());

exports.validatePromotionForCart = async ({ code, items }, authUser) => {
  const promotion = await promotionRepository.findByCode(code);
  if (!promotion) throw { message: "Invalid coupon code", statusCode: 404 };

  const lineItems = await toLineItems(items);
  const result = await evaluatePromotion({
    promotion,
    lineItems,
    buyerId: authUser.id,
  });

  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  return {
    ...result,
    subtotal: Number(subtotal.toFixed(2)),
    totalAfterDiscount: Number((subtotal - result.discountAmount).toFixed(2)),
  };
};

exports.resolvePromotionForOrder = async ({ couponCode, lineItems, buyerId }) => {
  const code = normalizeCode(couponCode);
  if (!code) return null;

  const promotion = await promotionRepository.findByCode(code);
  if (!promotion) throw { message: "Invalid coupon code", statusCode: 400 };

  const result = await evaluatePromotion({
    promotion,
    lineItems,
    buyerId,
  });

  return {
    promotion,
    result,
  };
};

exports.incrementUsage = async (promotionId) => {
  const promotion = await promotionRepository.findById(promotionId);
  if (!promotion) return;
  promotion.usedCount = Number(promotion.usedCount || 0) + 1;
  await promotionRepository.save(promotion);
};
