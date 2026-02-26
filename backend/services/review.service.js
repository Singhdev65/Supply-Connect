const { orderRepository, productRepository, reviewRepository } = require("../repositories");
const { USER_ROLES } = require("../config/roles");

const DELIVERED_STATUSES_FOR_REVIEW = ["Delivered", "Completed"];

const assertProductReadable = async (productId, user) => {
  const product = await productRepository.findByIdForViewer(productId);
  if (!product) throw { message: "Product not found", statusCode: 404 };

  if (user?.role === USER_ROLES.VENDOR) {
    if (!product.vendor?._id?.equals?.(user.id))
      throw { message: "Unauthorized", statusCode: 403 };
    return product;
  }

  if (!product.isPublished) throw { message: "Product not found", statusCode: 404 };
  return product;
};

const refreshProductRatingSummary = async (productId) => {
  const stats = await reviewRepository.aggregateProductRating(productId);
  const summary = stats[0] || {
    ratingAverage: 0,
    ratingCount: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  const product = await productRepository.findById(productId);
  if (!product) return summary;

  product.ratingAverage = Number(summary.ratingAverage || 0);
  product.ratingCount = Number(summary.ratingCount || 0);
  await productRepository.save(product);

  return summary;
};

exports.getProductReviews = async (productId, user) => {
  await assertProductReadable(productId, user);

  const [reviews, stats] = await Promise.all([
    reviewRepository.findByProduct(productId),
    reviewRepository.aggregateProductRating(productId),
  ]);

  const summary = stats[0] || {
    ratingAverage: 0,
    ratingCount: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  const viewerReviewId =
    user?.id &&
    reviews.find((review) => String(review.reviewer?._id) === String(user.id))?._id;

  let canWriteReview = false;
  let canWriteReviewReason = "Sign in as buyer to review this product";
  if (user?.role === USER_ROLES.BUYER) {
    const purchased = await orderRepository.existsBuyerPurchasedProduct(
      user.id,
      productId,
      DELIVERED_STATUSES_FOR_REVIEW,
    );
    canWriteReview = Boolean(purchased);
    canWriteReviewReason = purchased
      ? ""
      : "You can review this product after your delivered/completed order";
  } else if (user?.role === USER_ROLES.VENDOR) {
    canWriteReviewReason = "Vendors cannot review products";
  }

  return {
    summary,
    viewerReviewId: viewerReviewId || null,
    canWriteReview,
    canWriteReviewReason,
    reviews,
  };
};

exports.upsertBuyerReview = async (productId, data, user) => {
  if (user?.role !== USER_ROLES.BUYER) {
    throw { message: "Only buyers can submit reviews", statusCode: 403 };
  }

  const product = await assertProductReadable(productId, user);

  const purchased = await orderRepository.existsBuyerPurchasedProduct(
    user.id,
    productId,
    DELIVERED_STATUSES_FOR_REVIEW,
  );
  if (!purchased) {
    throw {
      message: "You can review only products you purchased and received",
      statusCode: 403,
    };
  }

  let review = await reviewRepository.findByProductAndReviewer(productId, user.id);

  if (!review) {
    review = await reviewRepository.create({
      product: product._id,
      vendor: product.vendor,
      reviewer: user.id,
      rating: data.rating,
      title: data.title || "",
      comment: data.comment || "",
    });
  } else {
    review.rating = data.rating;
    review.title = data.title || "";
    review.comment = data.comment || "";
    review = await reviewRepository.save(review);
  }

  await refreshProductRatingSummary(product._id);
  return reviewRepository.findById(review._id);
};

exports.respondToReview = async (reviewId, data, user) => {
  if (user?.role !== USER_ROLES.VENDOR) {
    throw { message: "Only vendors can respond to reviews", statusCode: 403 };
  }

  const review = await reviewRepository.findById(reviewId);
  if (!review) throw { message: "Review not found", statusCode: 404 };

  if (String(review.vendor) !== String(user.id)) {
    throw { message: "Unauthorized", statusCode: 403 };
  }

  if (typeof data.replyMessage === "string") {
    review.vendorReply = {
      message: data.replyMessage.trim(),
      repliedBy: user.id,
      repliedAt: new Date(),
    };
  }

  if (typeof data.vendorReaction === "string") {
    review.vendorReaction = data.vendorReaction;
  }

  const saved = await reviewRepository.save(review);
  return reviewRepository.findById(saved._id);
};
