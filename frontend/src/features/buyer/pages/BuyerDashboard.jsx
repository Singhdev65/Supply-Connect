import { CartOverlay } from "@/features/cart";
import { ProductGrid } from "@/features/products";
import { BuyerToolbar, FloatingActions } from "@/shared/ui";
import { BuyerCategoryBannerStrip, BuyerHeroBoard } from "../components";
import { useBuyerBoard } from "../hooks";

const BuyerDashboard = () => {
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
