const parseFlag = (value, defaultValue = true) => {
  if (value === undefined) return defaultValue;
  return ["true", "1", "yes", "on"].includes(String(value).toLowerCase());
};

export const featureFlags = {
  cart: parseFlag(import.meta.env.VITE_FEATURE_CART, true),
  products: parseFlag(import.meta.env.VITE_FEATURE_PRODUCTS, true),
  orders: parseFlag(import.meta.env.VITE_FEATURE_ORDERS, true),
  checkout: parseFlag(import.meta.env.VITE_FEATURE_CHECKOUT, true),
  payment: parseFlag(import.meta.env.VITE_FEATURE_PAYMENT, true),
  chat: parseFlag(import.meta.env.VITE_FEATURE_CHAT, true),
};

export const isFeatureEnabled = (featureName) =>
  Boolean(featureFlags[featureName]);

