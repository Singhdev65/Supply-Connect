import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useBuyerDashboard from "./useBuyerDashboard";
import { useCart } from "@/features/cart";
import { useChat } from "@/features/chat";
import { useAuth } from "@/shared/hooks";
import { buildBuyerProductDetailsPath, PATHS } from "@/utils/constants";

const useBuyerBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dashboard = useBuyerDashboard();
  const { cart, cartCount, addToCart, removeFromCart } = useCart();
  const { startChat } = useChat(user?.id);

  const openCart = useCallback(() => dashboard.setShowCart(true), [dashboard]);
  const closeCart = useCallback(() => dashboard.setShowCart(false), [dashboard]);
  const goToCheckout = useCallback(() => navigate(PATHS.BUYER_CHECKOUT), [navigate]);

  const handleStartChat = useCallback(
    async (vendorId) => {
      if (!vendorId) return;
      const conversation = await startChat(vendorId);
      if (conversation?._id) {
        navigate(PATHS.CHAT, { state: { conversationId: conversation._id } });
      }
    },
    [navigate, startChat],
  );

  const handleOpenProduct = useCallback(
    (product) => {
      if (!product?._id) return;
      navigate(buildBuyerProductDetailsPath(product._id));
    },
    [navigate],
  );

  const categoryCount = useMemo(
    () => new Set(dashboard.displayedProducts.map((product) => product.category)).size,
    [dashboard.displayedProducts],
  );

  return {
    ...dashboard,
    cart,
    cartCount,
    categoryCount,
    addToCart,
    removeFromCart,
    openCart,
    closeCart,
    goToCheckout,
    handleStartChat,
    handleOpenProduct,
  };
};

export default useBuyerBoard;
