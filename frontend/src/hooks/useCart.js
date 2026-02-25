import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "../store/cartSlice";

const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return {
    cart,
    cartCount,
    addToCart: (product) => dispatch(addToCart(product)),
    removeFromCart: (product) => dispatch(removeFromCart(product)),
    clearCart: () => dispatch(clearCart()),
  };
};

export default useCart;
