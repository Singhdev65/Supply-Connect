import BuyerToolbar from "./BuyerToolbar";
import ProductGrid from "./ProductGrid";
import FloatingActions from "./FloatingActions";
import CartOverlay from "./CartOverlay";

import useBuyerDashboard from "./useBuyerDashboard";
import useCart from "../../hooks/useCart";
import useChat from "../../hooks/useChat";

import { useNavigate } from "react-router-dom";
import { useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const {
    loading,
    displayedProducts,
    showCart,
    searchTerm,
    sortBy,
    setShowCart,
    setSearchTerm,
    setSortBy,
  } = useBuyerDashboard();

  const { cart, cartCount, addToCart, removeFromCart } = useCart();

  const { startChat } = useChat(user?.id);

  const handleStartChat = useCallback(
    async (vendorId) => {
      if (!vendorId) return;

      const conversation = await startChat(vendorId);
      console.log(conversation, "conversation");

      if (conversation?._id) {
        navigate("/chat", {
          state: { conversationId: conversation?._id },
        });
      }
    },
    [startChat, navigate],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 space-y-4">
        <BuyerToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {!loading && (
          <ProductGrid
            products={displayedProducts}
            cart={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
            startChat={handleStartChat}
          />
        )}
      </div>

      <FloatingActions
        cartCount={cartCount}
        onCartOpen={() => setShowCart(true)}
      />

      {showCart && (
        <CartOverlay
          cart={cart}
          onClose={() => setShowCart(false)}
          onSuccess={(order) =>
            navigate("/order-success", { state: { order } })
          }
        />
      )}
    </div>
  );
};

export default BuyerDashboard;
