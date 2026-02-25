const CART_KEY = "buyer_cart_v1";

export const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {}
};

export const clearCartStorage = () => {
  localStorage.removeItem(CART_KEY);
};
