import { useDispatch, useSelector } from "react-redux";
import { isFeatureEnabled } from "@/app/config/featureFlags";
import {
  addToCart,
  removeFromCart,
  clearCart,
} from "@/features/cart/store/cartSlice";

const useCart = () => {
  const dispatch = useDispatch();
  const cartEnabled = isFeatureEnabled("cart");
  const cart = useSelector((state) => state.cart?.items ?? []);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return {
    cart,
    cartCount,
    addToCart: (product) => cartEnabled && dispatch(addToCart(product)),
    removeFromCart: (product) =>
      cartEnabled && dispatch(removeFromCart(product)),
    clearCart: () => cartEnabled && dispatch(clearCart()),
  };
};

export default useCart;
