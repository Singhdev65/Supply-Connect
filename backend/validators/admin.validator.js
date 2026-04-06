const Joi = require("joi");
const { ADMIN_SUBROLES, ALL_PERMISSIONS } = require("../config/adminPermissions");

const objectId = Joi.string().trim().min(8).required();

exports.adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.updateUserStatusSchema = Joi.object({
  isBlocked: Joi.boolean().optional(),
  isSuspended: Joi.boolean().optional(),
  suspensionReason: Joi.string().trim().max(300).allow("").optional(),
  verificationStatus: Joi.string()
    .valid("unverified", "pending", "verified", "rejected")
    .optional(),
});

exports.resetUserPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).max(100).required(),
});

exports.updateAdminPermissionsSchema = Joi.object({
  adminSubRole: Joi.string()
    .valid(...Object.values(ADMIN_SUBROLES))
    .required(),
  adminPermissions: Joi.array()
    .items(Joi.string().valid(...ALL_PERMISSIONS))
    .default([]),
});

exports.updateSellerApprovalSchema = Joi.object({
  sellerStatus: Joi.string().valid("pending", "approved", "rejected", "suspended").required(),
  reason: Joi.string().trim().max(300).allow("").optional(),
});

exports.updateSellerCommercialsSchema = Joi.object({
  sellerCommissionRate: Joi.number().min(0).max(1).optional(),
  sellerSubscriptionPlan: Joi.string().trim().max(80).optional(),
});

exports.productModerationSchema = Joi.object({
  moderationStatus: Joi.string().valid("pending", "approved", "rejected").required(),
  moderationNotes: Joi.string().trim().max(500).allow("").optional(),
});

exports.productTaggingSchema = Joi.object({
  tags: Joi.array().items(Joi.string().trim().min(1).max(40)).max(30).required(),
});

exports.bulkProductImportSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        vendor: objectId,
        name: Joi.string().trim().min(2).max(200).required(),
        category: Joi.string().trim().required(),
        subcategory: Joi.string().trim().required(),
        description: Joi.string().allow("").optional(),
        price: Joi.number().positive().required(),
        stock: Joi.number().integer().min(0).required(),
        images: Joi.array().items(Joi.string().uri()).min(1).required(),
      }),
    )
    .min(1)
    .required(),
});

exports.manualOrderUpdateSchema = Joi.object({
  status: Joi.string().optional(),
  deliveryNotes: Joi.string().trim().max(300).allow("").optional(),
});

exports.refundApprovalSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  reason: Joi.string().trim().max(300).allow("").optional(),
  partial: Joi.boolean().default(false),
});

exports.payoutStatusUpdateSchema = Joi.object({
  status: Joi.string().valid("requested", "approved", "paid", "rejected").required(),
  processedNote: Joi.string().trim().max(500).allow("").optional(),
  transactionRef: Joi.string().trim().max(120).allow("").optional(),
});

exports.commissionRuleSchema = Joi.object({
  name: Joi.string().trim().min(3).max(120).required(),
  scope: Joi.string().valid("global", "category", "seller").required(),
  category: Joi.string().trim().allow("").optional(),
  seller: Joi.string().trim().allow("").optional(),
  commissionRate: Joi.number().min(0).max(1).required(),
  platformFee: Joi.number().min(0).default(0),
  transactionFeeRate: Joi.number().min(0).max(1).default(0),
  startsAt: Joi.date().required(),
  endsAt: Joi.date().greater(Joi.ref("startsAt")).required(),
  isActive: Joi.boolean().default(true),
});

exports.updateCommissionRuleSchema = exports.commissionRuleSchema.fork(
  ["name", "scope", "commissionRate", "startsAt", "endsAt"],
  (schema) => schema.optional(),
);

exports.cmsPageSchema = Joi.object({
  slug: Joi.string().trim().lowercase().min(2).max(140).required(),
  title: Joi.string().trim().min(2).max(180).required(),
  content: Joi.string().allow("").optional(),
  seoTitle: Joi.string().allow("").optional(),
  seoDescription: Joi.string().allow("").optional(),
  status: Joi.string().valid("draft", "published").default("draft"),
  pageType: Joi.string().valid("static", "homepage", "blog", "faq", "landing").default("static"),
});

exports.bannerSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  imageUrl: Joi.string().uri().required(),
  ctaText: Joi.string().allow("").optional(),
  ctaUrl: Joi.string().allow("").optional(),
  placement: Joi.string().valid("homepage", "category", "product", "campaign").default("homepage"),
  startsAt: Joi.date().optional(),
  endsAt: Joi.date().allow(null).optional(),
  isActive: Joi.boolean().default(true),
  order: Joi.number().integer().min(0).default(0),
});

exports.supportTicketSchema = Joi.object({
  subject: Joi.string().trim().min(3).max(180).required(),
  description: Joi.string().trim().min(5).max(3000).required(),
  category: Joi.string().valid("general", "payment", "refund", "return", "order", "dispute", "technical").default("general"),
  priority: Joi.string().valid("low", "medium", "high", "urgent").default("medium"),
  relatedOrder: Joi.string().allow("").optional(),
});

exports.supportTicketReplySchema = Joi.object({
  message: Joi.string().trim().min(1).max(3000).required(),
  status: Joi.string().valid("open", "in_progress", "resolved", "closed").optional(),
  assignedTo: Joi.string().allow("").optional(),
});

exports.disputeSchema = Joi.object({
  raisedBy: objectId,
  againstUser: Joi.string().allow("").optional(),
  order: Joi.string().allow("").optional(),
  returnRequest: Joi.string().allow("").optional(),
  type: Joi.string().valid("refund", "return", "seller_payout", "order_issue", "review_abuse", "other").default("other"),
  summary: Joi.string().trim().min(3).max(300).required(),
  details: Joi.string().allow("").optional(),
});

exports.disputeResolutionSchema = Joi.object({
  status: Joi.string().valid("open", "under_review", "resolved", "rejected").required(),
  resolution: Joi.string().trim().max(3000).allow("").optional(),
});

exports.reviewModerationSchema = Joi.object({
  action: Joi.string().valid("remove", "flag", "restore").required(),
  reason: Joi.string().trim().max(400).allow("").optional(),
});

exports.returnUpdateSchema = Joi.object({
  status: Joi.string().valid("requested", "accepted", "declined", "pickup_scheduled", "received", "replacement_shipped", "completed").optional(),
  refundStatus: Joi.string().valid("not_applicable", "pending", "processed").optional(),
  vendorNote: Joi.string().trim().max(500).allow("").optional(),
});

exports.cancelOrderSchema = Joi.object({
  reason: Joi.string().trim().max(300).allow("").optional(),
});

exports.taxonomyUpsertSchema = Joi.object({
  value: Joi.any().required(),
});
