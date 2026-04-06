const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminAccess = require("../middleware/adminAccess");
const validate = require("../middleware/validate");
const { adminController } = require("../controllers");
const { admin } = require("../validators");
const { PERMISSIONS } = require("../config/adminPermissions");

router.post("/login", validate(admin.adminLoginSchema), adminController.adminLogin);

router.get("/users", auth(), adminAccess([PERMISSIONS.USERS_VIEW]), adminController.listUsers);
router.get("/activity-logs", auth(), adminAccess([PERMISSIONS.USERS_ACTIVITY]), adminController.listActivityLogs);
router.patch(
  "/users/:userId/status",
  auth(),
  adminAccess([PERMISSIONS.USERS_EDIT]),
  validate(admin.updateUserStatusSchema),
  adminController.updateUserStatus,
);
router.patch(
  "/users/:userId/reset-password",
  auth(),
  adminAccess([PERMISSIONS.USERS_RESET_PASSWORD]),
  validate(admin.resetUserPasswordSchema),
  adminController.resetUserPassword,
);
router.get(
  "/users/:userId/activity",
  auth(),
  adminAccess([PERMISSIONS.USERS_ACTIVITY]),
  adminController.getUserActivityLogs,
);
router.patch(
  "/admins/:userId/permissions",
  auth(),
  adminAccess([PERMISSIONS.ADMINS_MANAGE]),
  validate(admin.updateAdminPermissionsSchema),
  adminController.updateAdminPermissions,
);

router.get("/sellers/pending", auth(), adminAccess([PERMISSIONS.SELLERS_APPROVE]), adminController.listPendingSellers);
router.patch(
  "/sellers/:sellerId/approval",
  auth(),
  adminAccess([PERMISSIONS.SELLERS_APPROVE]),
  validate(admin.updateSellerApprovalSchema),
  adminController.updateSellerApproval,
);
router.patch(
  "/sellers/:sellerId/commercials",
  auth(),
  adminAccess([PERMISSIONS.SELLERS_MANAGE]),
  validate(admin.updateSellerCommercialsSchema),
  adminController.updateSellerCommercials,
);
router.get("/sellers/performance", auth(), adminAccess([PERMISSIONS.ANALYTICS_VIEW]), adminController.getSellerPerformance);
router.get("/sellers/ratings-overview", auth(), adminAccess([PERMISSIONS.ANALYTICS_VIEW]), adminController.getSellerRatingsOverview);
router.get("/sellers/payouts", auth(), adminAccess([PERMISSIONS.SELLERS_PAYOUTS]), adminController.listSellerPayouts);
router.patch(
  "/sellers/payouts/:payoutId",
  auth(),
  adminAccess([PERMISSIONS.SELLERS_PAYOUTS]),
  validate(admin.payoutStatusUpdateSchema),
  adminController.updateSellerPayoutStatus,
);

router.get("/products", auth(), adminAccess([PERMISSIONS.PRODUCTS_MODERATE]), adminController.listProductsForModeration);
router.patch(
  "/products/:productId/moderate",
  auth(),
  adminAccess([PERMISSIONS.PRODUCTS_MODERATE]),
  validate(admin.productModerationSchema),
  adminController.moderateProduct,
);
router.post(
  "/products/bulk-import",
  auth(),
  adminAccess([PERMISSIONS.PRODUCTS_BULK]),
  validate(admin.bulkProductImportSchema),
  adminController.bulkImportProducts,
);
router.get("/products/bulk-export", auth(), adminAccess([PERMISSIONS.PRODUCTS_BULK]), adminController.bulkExportProducts);
router.patch(
  "/products/:productId/tags",
  auth(),
  adminAccess([PERMISSIONS.PRODUCTS_MODERATE]),
  validate(admin.productTaggingSchema),
  adminController.updateProductTags,
);
router.post("/products/reindex", auth(), adminAccess([PERMISSIONS.PRODUCTS_MODERATE]), adminController.reindexProducts);
router.get("/products/inventory-monitoring", auth(), adminAccess([PERMISSIONS.PRODUCTS_MODERATE]), adminController.getInventoryMonitoring);
router.get("/taxonomy", auth(), adminAccess([PERMISSIONS.PRODUCTS_MANAGE_CATEGORIES]), adminController.getTaxonomy);
router.put(
  "/taxonomy/:key",
  auth(),
  adminAccess([PERMISSIONS.PRODUCTS_MANAGE_CATEGORIES]),
  validate(admin.taxonomyUpsertSchema),
  adminController.upsertTaxonomy,
);

router.get("/orders", auth(), adminAccess([PERMISSIONS.ORDERS_VIEW]), adminController.listOrders);
router.patch(
  "/orders/:orderId",
  auth(),
  adminAccess([PERMISSIONS.ORDERS_MODIFY]),
  validate(admin.manualOrderUpdateSchema),
  adminController.modifyOrder,
);
router.post(
  "/orders/:orderId/refund",
  auth(),
  adminAccess([PERMISSIONS.ORDERS_REFUNDS]),
  validate(admin.refundApprovalSchema),
  adminController.approveRefund,
);
router.patch(
  "/orders/:orderId/cancel",
  auth(),
  adminAccess([PERMISSIONS.ORDERS_MODIFY]),
  validate(admin.cancelOrderSchema),
  adminController.cancelOrder,
);
router.get("/orders/shipment-tracking-overview", auth(), adminAccess([PERMISSIONS.ORDERS_VIEW]), adminController.getShipmentTrackingOverview);

router.get("/returns", auth(), adminAccess([PERMISSIONS.RETURNS_MANAGE]), adminController.listReturns);
router.patch(
  "/returns/:returnId",
  auth(),
  adminAccess([PERMISSIONS.RETURNS_MANAGE]),
  validate(admin.returnUpdateSchema),
  adminController.updateReturn,
);

router.get("/commissions/rules", auth(), adminAccess([PERMISSIONS.COMMISSIONS_MANAGE]), adminController.listCommissionRules);
router.post(
  "/commissions/rules",
  auth(),
  adminAccess([PERMISSIONS.COMMISSIONS_MANAGE]),
  validate(admin.commissionRuleSchema),
  adminController.createCommissionRule,
);
router.patch(
  "/commissions/rules/:ruleId",
  auth(),
  adminAccess([PERMISSIONS.COMMISSIONS_MANAGE]),
  validate(admin.updateCommissionRuleSchema),
  adminController.updateCommissionRule,
);

router.get("/finance/overview", auth(), adminAccess([PERMISSIONS.FINANCE_VIEW]), adminController.getFinanceOverview);
router.post("/finance/invoice/:orderId", auth(), adminAccess([PERMISSIONS.FINANCE_MANAGE]), adminController.generateInvoice);

router.get("/analytics/overview", auth(), adminAccess([PERMISSIONS.ANALYTICS_VIEW]), adminController.getAnalyticsOverview);
router.get("/analytics/export", auth(), adminAccess([PERMISSIONS.ANALYTICS_VIEW]), adminController.exportReport);

router.get("/promotions", auth(), adminAccess([PERMISSIONS.PROMOTIONS_MANAGE]), adminController.listPromotions);

router.get("/cms/pages", auth(), adminAccess([PERMISSIONS.CMS_MANAGE]), adminController.listCmsPages);
router.post("/cms/pages", auth(), adminAccess([PERMISSIONS.CMS_MANAGE]), validate(admin.cmsPageSchema), adminController.upsertCmsPage);
router.get("/cms/banners", auth(), adminAccess([PERMISSIONS.CMS_MANAGE]), adminController.listBanners);
router.post("/cms/banners", auth(), adminAccess([PERMISSIONS.CMS_MANAGE]), validate(admin.bannerSchema), adminController.upsertBanner);

router.get("/reviews", auth(), adminAccess([PERMISSIONS.REVIEWS_MODERATE]), adminController.listReviewsForModeration);
router.patch(
  "/reviews/:reviewId/moderate",
  auth(),
  adminAccess([PERMISSIONS.REVIEWS_MODERATE]),
  validate(admin.reviewModerationSchema),
  adminController.moderateReview,
);

router.post("/support/tickets", auth(), validate(admin.supportTicketSchema), adminController.createSupportTicket);
router.get("/support/tickets", auth(), adminAccess([PERMISSIONS.SUPPORT_MANAGE]), adminController.listSupportTickets);
router.post(
  "/support/tickets/:ticketId/reply",
  auth(),
  validate(admin.supportTicketReplySchema),
  adminController.replySupportTicket,
);

router.post("/disputes", auth(), validate(admin.disputeSchema), adminController.createDispute);
router.get("/disputes", auth(), adminAccess([PERMISSIONS.DISPUTES_MANAGE]), adminController.listDisputes);
router.patch(
  "/disputes/:disputeId/resolve",
  auth(),
  adminAccess([PERMISSIONS.DISPUTES_MANAGE]),
  validate(admin.disputeResolutionSchema),
  adminController.resolveDispute,
);

module.exports = router;
