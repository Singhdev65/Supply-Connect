const USER_ROLES = {
  BUYER: "buyer",
  VENDOR: "vendor",
  ADMIN: "admin",
  OPS_MANAGER: "ops_manager",
  SUPPORT: "support",
  FINANCE: "finance",
};

const ROLE_VALUES = Object.values(USER_ROLES);

// Only these roles can self-register through public signup.
const PUBLIC_SIGNUP_ROLES = [USER_ROLES.BUYER, USER_ROLES.VENDOR];

module.exports = {
  USER_ROLES,
  ROLE_VALUES,
  PUBLIC_SIGNUP_ROLES,
};
