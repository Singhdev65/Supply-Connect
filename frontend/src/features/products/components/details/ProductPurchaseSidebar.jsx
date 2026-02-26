import {
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

const ProductPurchaseSidebar = ({
  price,
  stock,
  cartQty = 0,
  onAdd,
  onRemove,
  onChatSeller,
  vendorName,
  isBuyerView = true,
}) => {
  return (
    <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-3xl font-bold text-blue-600">Rs. {price}</p>
        <p className="mt-1 text-sm text-gray-600">Available stock: {stock}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p className="inline-flex items-center gap-2">
            <Truck size={16} className="text-emerald-600" />
            Same-day dispatch available
          </p>
          <p className="inline-flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600" />
            Secure payment and trusted seller
          </p>
          <p className="inline-flex items-center gap-2">
            <RotateCcw size={16} className="text-amber-600" />
            Easy returns on eligible items
          </p>
        </div>

        {isBuyerView && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {cartQty > 0 ? (
              <div className="flex items-center overflow-hidden rounded-lg border border-blue-200 bg-blue-50">
                <button
                  onClick={onRemove}
                  className="flex h-9 w-9 items-center justify-center hover:bg-blue-100"
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 text-sm font-semibold">{cartQty}</span>
                <button
                  onClick={onAdd}
                  className="flex h-9 w-9 items-center justify-center hover:bg-blue-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={onAdd}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <ShoppingCart size={16} />
                Add to cart
              </button>
            )}

            <button
              onClick={onChatSeller}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <MessageCircle size={16} />
              Chat seller
            </button>
          </div>
        )}
      </div>

      {vendorName && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          <p className="text-xs uppercase tracking-wide text-gray-500">Sold by</p>
          <p className="mt-1 font-medium text-gray-900">{vendorName}</p>
        </div>
      )}
    </div>
  );
};

export default ProductPurchaseSidebar;
