import { Trash2, Edit3 } from "lucide-react";

const IMAGE_HEIGHT = 180;

const ProductCard = ({
  product,
  cartQty = 0,
  onAdd,
  onRemove,
  deleteProduct,
  onEdit,
  startChat, // NEW: callback to message vendor
}) => {
  const isOutOfStock = product.stock === 0;
  const isInCart = cartQty > 0;
  const isBuyer = !!onAdd;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col h-full group relative">
      {/* IMAGE */}
      <div
        className="relative w-full bg-gray-100 overflow-hidden"
        style={{ height: IMAGE_HEIGHT }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg uppercase">
              Out of Stock
            </span>
          </div>
        )}

        {/* VENDOR ACTIONS OVERLAY */}
        {!isBuyer && (onEdit || deleteProduct) && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-lg flex items-center justify-center transition"
                title="Edit Product"
              >
                <Edit3 size={16} />
              </button>
            )}
            {deleteProduct && (
              <button
                onClick={() => deleteProduct(product._id)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg flex items-center justify-center transition"
                title="Delete Product"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {product.description || "No description"}
          </p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="font-bold text-blue-600 text-lg">
              ₹{product.price}
            </span>
            <span className="text-xs text-gray-400 ml-2">
              Stock: {product.stock}
            </span>
          </div>
        </div>

        {/* BUYER CONTROLS */}
        {isBuyer && (
          <div className="mt-3 flex flex-col gap-2">
            {!isInCart && !isOutOfStock && (
              <button
                onClick={onAdd}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 font-medium transition shadow"
              >
                Add to Cart
              </button>
            )}

            {isInCart && (
              <div className="flex items-center justify-between bg-gray-100 rounded-xl px-3 py-2 mt-1 shadow-sm">
                <button
                  onClick={onRemove}
                  className="px-3 py-1 bg-white rounded shadow hover:bg-gray-50 transition"
                >
                  −
                </button>

                <span className="font-semibold">{cartQty}</span>

                <button
                  onClick={onAdd}
                  disabled={cartQty >= product.stock}
                  className="px-3 py-1 bg-white rounded shadow hover:bg-gray-50 transition disabled:opacity-50"
                >
                  +
                </button>
              </div>
            )}

            {isOutOfStock && (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-600 rounded-xl py-2 font-medium mt-1"
              >
                Out of Stock
              </button>
            )}

            {/* NEW: Message Vendor Button */}
            {startChat && (
              <button
                onClick={() => startChat(product.vendor)}
                className="w-full mt-2 text-blue-600 underline font-medium hover:text-blue-800"
              >
                Message Vendor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
