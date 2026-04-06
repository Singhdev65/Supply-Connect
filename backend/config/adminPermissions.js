const ADMIN_SUBROLES = {
  SUPER_ADMIN: "super_admin",
  FINANCE_ADMIN: "finance_admin",
  SUPPORT_ADMIN: "support_admin",
  NONE: "none",
};

const PERMISSIONS = {
  USERS_VIEW: "users:view",
  USERS_EDIT: "users:edit",
  USERS_BLOCK: "users:block",
  USERS_RESET_PASSWORD: "users:reset_password",
  USERS_ACTIVITY: "users:activity",
  SELLERS_APPROVE: "sellers:approve",
  SELLERS_MANAGE: "sellers:manage",
  SELLERS_PAYOUTS: "sellers:payouts",
  PRODUCTS_MODERATE: "products:moderate",
  PRODUCTS_MANAGE_CATEGORIES: "products:manage_categories",
  PRODUCTS_BULK: "products:bulk",
  ORDERS_VIEW: "orders:view",
  ORDERS_MODIFY: "orders:modify",
  ORDERS_REFUNDS: "orders:refunds",
  RETURNS_MANAGE: "returns:manage",
  COMMISSIONS_MANAGE: "commissions:manage",
  FINANCE_VIEW: "finance:view",
  FINANCE_MANAGE: "finance:manage",
  ANALYTICS_VIEW: "analytics:view",
  PROMOTIONS_MANAGE: "promotions:manage",
  CMS_MANAGE: "cms:manage",
  REVIEWS_MODERATE: "reviews:moderate",
  SUPPORT_MANAGE: "support:manage",
  DISPUTES_MANAGE: "disputes:manage",
  ADMINS_MANAGE: "admins:manage",
};

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

const SUBROLE_PERMISSIONS = {
  [ADMIN_SUBROLES.SUPER_ADMIN]: ALL_PERMISSIONS,
  [ADMIN_SUBROLES.FINANCE_ADMIN]: [
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.FINANCE_MANAGE,
    PERMISSIONS.SELLERS_PAYOUTS,
    PERMISSIONS.COMMISSIONS_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_REFUNDS,
  ],
  [ADMIN_SUBROLES.SUPPORT_ADMIN]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_ACTIVITY,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_MODIFY,
    PERMISSIONS.RETURNS_MANAGE,
    PERMISSIONS.REVIEWS_MODERATE,
    PERMISSIONS.SUPPORT_MANAGE,
    PERMISSIONS.DISPUTES_MANAGE,
  ],
  [ADMIN_SUBROLES.NONE]: [],
};

const ADMIN_LIKE_ROLES = ["admin", "ops_manager", "finance", "support"];

const resolvePermissions = (user) => {
  if (!user) return [];
  const roleMappedSubrole =
    user.role === "finance"
      ? ADMIN_SUBROLES.FINANCE_ADMIN
      : user.role === "support"
        ? ADMIN_SUBROLES.SUPPORT_ADMIN
        : user.adminSubRole || ADMIN_SUBROLES.NONE;

  const base = SUBROLE_PERMISSIONS[roleMappedSubrole] || [];
  const extra = Array.isArray(user.adminPermissions) ? user.adminPermissions : [];
  return [...new Set([...base, ...extra])];
};

module.exports = {
  ADMIN_SUBROLES,
  PERMISSIONS,
  ALL_PERMISSIONS,
  SUBROLE_PERMISSIONS,
  ADMIN_LIKE_ROLES,
  resolvePermissions,
};
