import { CartOverlay } from "@/features/cart";
import { ProductGrid } from "@/features/products";
import { BuyerToolbar, FloatingActions } from "@/shared/ui";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/utils/constants";
import { useEffect, useState } from "react";
import { fetchActiveDealsApi } from "@/features/buyer/api";
import { BuyerCategoryBannerStrip, BuyerHeroBoard } from "../components";
import { useBuyerBoard } from "../hooks";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const {
    loading,
    loadingMore,
    hasMore,
    loadMore,
    categoryOptions,
    categoryBanners,
    selectedCategory,
    displayedProducts,
    showCart,
    cart,
    cartCount,
    searchTerm,
    sortBy,
    addToCart,
    removeFromCart,
    handleStartChat,
    handleOpenProduct,
    categoryCount,
    openCart,
    closeCart,
    goToCheckout,
    setSelectedCategory,
    setSearchTerm,
    setSortBy,
  } = useBuyerBoard();

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const data = await fetchActiveDealsApi();
        setDeals(data || []);
      } catch (error) {
        console.error("Failed to load deals", error);
      }
    };

    loadDeals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="space-y-4 p-6">
        <BuyerHeroBoard
          productCount={displayedProducts.length}
          categoryCount={categoryCount}
        />

        <BuyerToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categoryOptions={categoryOptions}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          productCount={displayedProducts.length}
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(PATHS.BUYER_WISHLIST)}
            className="rounded-lg border border-pink-200 bg-pink-50 px-3 py-2 text-sm font-medium text-pink-700"
          >
            Open Wishlist
          </button>
          <button
            onClick={() => navigate(PATHS.BUYER_RECENTLY_VIEWED)}
            className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700"
          >
            Recently Viewed
          </button>
        </div>

        {deals.length ? (
          <div className="flex flex-wrap gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
            {deals.slice(0, 6).map((deal) => (
              <span
                key={deal.code}
                className="rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-800"
              >
                {deal.code}: {deal.discountType === "percentage" ? `${deal.discountValue}%` : `Rs ${deal.discountValue}`}
              </span>
            ))}
          </div>
        ) : null}

        <BuyerCategoryBannerStrip category={selectedCategory} banners={categoryBanners} />

        {!loading && (
          <ProductGrid
            products={displayedProducts}
            cart={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
            startChat={handleStartChat}
            onOpenProduct={handleOpenProduct}
            onEndReached={loadMore}
            hasMore={hasMore}
            loadingMore={loadingMore}
          />
        )}
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading products...
          </div>
        )}
      </div>

      <FloatingActions cartCount={cartCount} onCartOpen={openCart} />

      {showCart && (
        <CartOverlay
          onClose={closeCart}
          onSuccess={goToCheckout}
        />
      )}
    </div>
  );
};

export default BuyerDashboard;
