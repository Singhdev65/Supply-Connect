const { adminService } = require("../services");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

exports.adminLogin = asyncHandler(async (req, res) => {
  const data = await adminService.adminLogin(req.body);
  return success(res, "Admin login successful", data);
});

exports.listUsers = asyncHandler(async (req, res) => success(res, "Users fetched", await adminService.listUsers(req.query)));
exports.listActivityLogs = asyncHandler(async (req, res) => success(res, "Activity logs fetched", await adminService.listActivityLogs(req.query)));
exports.updateUserStatus = asyncHandler(async (req, res) => success(res, "User status updated", await adminService.updateUserStatus(req.params.userId, req.body, req.admin, req)));
exports.resetUserPassword = asyncHandler(async (req, res) => success(res, "Password reset", await adminService.resetUserPassword(req.params.userId, req.body.newPassword, req.admin, req)));
exports.getUserActivityLogs = asyncHandler(async (req, res) => success(res, "User activity logs fetched", await adminService.getUserActivityLogs(req.params.userId, req.query)));
exports.updateAdminPermissions = asyncHandler(async (req, res) => success(res, "Admin permissions updated", await adminService.updateAdminPermissions(req.params.userId, req.body, req.admin, req)));

exports.listPendingSellers = asyncHandler(async (_req, res) => success(res, "Pending sellers fetched", await adminService.listPendingSellers()));
exports.updateSellerApproval = asyncHandler(async (req, res) => success(res, "Seller status updated", await adminService.updateSellerApproval(req.params.sellerId, req.body, req.admin, req)));
exports.updateSellerCommercials = asyncHandler(async (req, res) => success(res, "Seller commercials updated", await adminService.updateSellerCommercials(req.params.sellerId, req.body, req.admin, req)));
exports.getSellerPerformance = asyncHandler(async (req, res) => success(res, "Seller performance fetched", await adminService.getSellerPerformance(req.query)));
exports.getSellerRatingsOverview = asyncHandler(async (_req, res) => success(res, "Seller ratings overview fetched", await adminService.getSellerRatingsOverview()));
exports.listSellerPayouts = asyncHandler(async (req, res) => success(res, "Seller payouts fetched", await adminService.listSellerPayouts(req.query)));
exports.updateSellerPayoutStatus = asyncHandler(async (req, res) => success(res, "Seller payout updated", await adminService.updateSellerPayoutStatus(req.params.payoutId, req.body, req.admin, req)));

exports.listProductsForModeration = asyncHandler(async (req, res) => success(res, "Products fetched", await adminService.listProductsForModeration(req.query)));
exports.moderateProduct = asyncHandler(async (req, res) => success(res, "Product moderation updated", await adminService.moderateProduct(req.params.productId, req.body, req.admin, req)));
exports.bulkImportProducts = asyncHandler(async (req, res) => success(res, "Bulk product import completed", await adminService.bulkImportProducts(req.body.products, req.admin, req), 201));
exports.bulkExportProducts = asyncHandler(async (req, res) => success(res, "Bulk product export data fetched", await adminService.bulkExportProducts(req.query)));
exports.updateProductTags = asyncHandler(async (req, res) => success(res, "Product tags updated", await adminService.updateProductTags(req.params.productId, req.body.tags, req.admin, req)));
exports.reindexProducts = asyncHandler(async (req, res) => success(res, "Product search index rebuilt", await adminService.reindexProducts(req.admin, req)));
exports.getInventoryMonitoring = asyncHandler(async (_req, res) => success(res, "Inventory monitoring fetched", await adminService.getInventoryMonitoring()));
exports.getTaxonomy = asyncHandler(async (_req, res) => success(res, "Product taxonomy fetched", await adminService.getTaxonomy()));
exports.upsertTaxonomy = asyncHandler(async (req, res) => success(res, "Product taxonomy updated", await adminService.upsertTaxonomy(req.params.key, req.body.value, req.admin, req)));

exports.listOrders = asyncHandler(async (req, res) => success(res, "Marketplace orders fetched", await adminService.listOrders(req.query)));
exports.modifyOrder = asyncHandler(async (req, res) => success(res, "Order modified", await adminService.modifyOrder(req.params.orderId, req.body, req.admin, req)));
exports.approveRefund = asyncHandler(async (req, res) => success(res, "Refund approved", await adminService.approveRefund(req.params.orderId, req.body, req.admin, req)));
exports.cancelOrder = asyncHandler(async (req, res) => success(res, "Order cancelled", await adminService.cancelOrder(req.params.orderId, req.body.reason || "", req.admin, req)));
exports.getShipmentTrackingOverview = asyncHandler(async (_req, res) => success(res, "Shipment tracking overview fetched", await adminService.getShipmentTrackingOverview()));
exports.listReturns = asyncHandler(async (req, res) => success(res, "Returns fetched", await adminService.listReturns(req.query)));
exports.updateReturn = asyncHandler(async (req, res) => success(res, "Return updated", await adminService.updateReturn(req.params.returnId, req.body, req.admin, req)));

exports.listCommissionRules = asyncHandler(async (_req, res) => success(res, "Commission rules fetched", await adminService.listCommissionRules()));
exports.createCommissionRule = asyncHandler(async (req, res) => success(res, "Commission rule created", await adminService.createCommissionRule(req.body, req.admin, req), 201));
exports.updateCommissionRule = asyncHandler(async (req, res) => success(res, "Commission rule updated", await adminService.updateCommissionRule(req.params.ruleId, req.body, req.admin, req)));

exports.getFinanceOverview = asyncHandler(async (_req, res) => success(res, "Finance overview fetched", await adminService.getFinanceOverview()));
exports.generateInvoice = asyncHandler(async (req, res) => success(res, "Invoice generated", await adminService.generateInvoice(req.params.orderId, req.admin, req)));

exports.getAnalyticsOverview = asyncHandler(async (_req, res) => success(res, "Analytics overview fetched", await adminService.getAnalyticsOverview()));
exports.exportReport = asyncHandler(async (_req, res) => success(res, "Report export generated", await adminService.exportReport()));

exports.listPromotions = asyncHandler(async (_req, res) => success(res, "Promotions fetched", await adminService.listPromotions()));
exports.listCmsPages = asyncHandler(async (_req, res) => success(res, "CMS pages fetched", await adminService.listCmsPages()));
exports.upsertCmsPage = asyncHandler(async (req, res) => success(res, "CMS page saved", await adminService.upsertCmsPage(req.body, req.admin, req)));
exports.listBanners = asyncHandler(async (req, res) => success(res, "Banners fetched", await adminService.listBanners(req.query.placement || "")));
exports.upsertBanner = asyncHandler(async (req, res) => success(res, "Banner saved", await adminService.upsertBanner(req.body, req.admin, req)));

exports.listReviewsForModeration = asyncHandler(async (req, res) => success(res, "Reviews fetched", await adminService.listReviewsForModeration(req.query)));
exports.moderateReview = asyncHandler(async (req, res) => success(res, "Review moderated", await adminService.moderateReview(req.params.reviewId, req.body, req.admin, req)));

exports.createSupportTicket = asyncHandler(async (req, res) => success(res, "Support ticket created", await adminService.createSupportTicket(req.body, req.user, req), 201));
exports.listSupportTickets = asyncHandler(async (req, res) => success(res, "Support tickets fetched", await adminService.listSupportTickets(req.query)));
exports.replySupportTicket = asyncHandler(async (req, res) => success(res, "Support ticket updated", await adminService.replySupportTicket(req.params.ticketId, req.body, req.user, req)));

exports.createDispute = asyncHandler(async (req, res) => success(res, "Dispute created", await adminService.createDispute(req.body, req.user, req), 201));
exports.listDisputes = asyncHandler(async (req, res) => success(res, "Disputes fetched", await adminService.listDisputes(req.query)));
exports.resolveDispute = asyncHandler(async (req, res) => success(res, "Dispute resolved", await adminService.resolveDispute(req.params.disputeId, req.body, req.admin, req)));
