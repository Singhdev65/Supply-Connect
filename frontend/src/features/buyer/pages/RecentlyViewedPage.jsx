import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/features/cart";
import { ProductGrid } from "@/features/products";
import { useRecentlyViewed } from "@/features/buyer/hooks";
import { PATHS, buildBuyerProductDetailsPath } from "@/utils/constants";

const RecentlyViewedPage = () => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useCart();
  const { items, loading } = useRecentlyViewed();

  const products = items
    .map((entry) => entry.details)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Recently Viewed</h1>
          <button
            onClick={() => navigate(PATHS.BUYER_HOME)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            Back to shopping
          </button>
        </div>

        {!loading && items.length ? (
          <p className="text-sm text-gray-600">
            Last viewed: {dayjs(items[0].viewedAt).format("DD MMM YYYY, hh:mm A")}
          </p>
        ) : null}

        {loading ? (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-600">
            Loading recently viewed products...
          </div>
        ) : (
          <ProductGrid
            products={products}
            cart={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onOpenProduct={(product) => navigate(buildBuyerProductDetailsPath(product._id))}
            hasMore={false}
            loadingMore={false}
            onEndReached={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default RecentlyViewedPage;
