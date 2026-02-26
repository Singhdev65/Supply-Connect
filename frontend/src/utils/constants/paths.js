import { USER_ROLES } from "./appConstants";

export const PATH_SEGMENTS = {
  LOGIN: "login",
  SIGNUP: "signup",
  CHAT: "chat",
  CHECKOUT: "checkout",
  PAYMENT_WITH_ORDER_ID: "payment/:orderId",
  PRODUCT_DETAILS: "products/:id",
  PROFILE: "profile",
  ORDER_SUCCESS: "order-success",
  ORDERS: "orders",
  ORDER_DETAILS: "orders/:id",
};

export const PATHS = {
  ROOT: "/",
  NOT_FOUND: "*",
  LOGIN: "/login",
  SIGNUP: "/signup",
  CHAT: "/chat",
  VENDOR_HOME: "/vendor",
  BUYER_HOME: "/buyer",
  BUYER_CHECKOUT: "/buyer/checkout",
  BUYER_PAYMENT_WITH_ORDER_ID: "/buyer/payment/:orderId",
  BUYER_PRODUCT_DETAILS: "/buyer/products/:id",
  VENDOR_PRODUCT_DETAILS: "/vendor/products/:id",
  BUYER_PROFILE: "/buyer/profile",
  VENDOR_PROFILE: "/vendor/profile",
  BUYER_ORDER_SUCCESS: "/buyer/order-success",
  BUYER_ORDERS: "/buyer/orders",
  BUYER_ORDER_DETAILS: "/buyer/orders/:id",
};

export const buildRoleHomePath = (role) =>
  role === USER_ROLES.VENDOR ? PATHS.VENDOR_HOME : PATHS.BUYER_HOME;

export const buildRoleOrdersPath = (role) => `${buildRoleHomePath(role)}/orders`;

export const buildRoleChatPath = (role) => `${buildRoleHomePath(role)}/chat`;

export const buildRoleProfilePath = (role) => `${buildRoleHomePath(role)}/profile`;

export const buildBuyerPaymentPath = (orderId) => `/buyer/payment/${orderId}`;

export const buildBuyerOrderDetailsPath = (orderId) => `/buyer/orders/${orderId}`;

export const buildBuyerProductDetailsPath = (productId) => `/buyer/products/${productId}`;

export const buildVendorProductDetailsPath = (productId) => `/vendor/products/${productId}`;

export const buildBuyerProfilePath = () => PATHS.BUYER_PROFILE;
