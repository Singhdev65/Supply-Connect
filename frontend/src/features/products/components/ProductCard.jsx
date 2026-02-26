import {
  ShoppingCart,
  MessageCircle,
  Plus,
  Minus,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { memo, useCallback } from "react";
import { PRODUCT_CATEGORY_LABEL_MAP, PRODUCT_SUBCATEGORY_LABEL_MAP } from "@/utils/constants";

const IMAGE_HEIGHT = 280;

const ProductCard = memo(
  ({
    product,
    cartQty = 0,
    onAdd,
    onRemove,
    startChat,
    isVendor = false,
    onEdit,
    onDelete,
    onOpenProduct,
  }) => {
    const isOutOfStock = product.stock === 0;
    const isInCart = cartQty > 0;

    const handleChatClick = useCallback(
      (e) => {
        e.stopPropagation();
        startChat?.(product.vendor?._id);
      },
      [startChat, product.vendor?._id],
    );

    const handleDelete = useCallback(
      (e) => {
        e.stopPropagation();
        const confirmDelete = window.confirm("Delete this product?");
        if (confirmDelete) onDelete?.(product._id);
      },
      [onDelete, product._id],
    );

    const handleEdit = useCallback(
      (e) => {
        e.stopPropagation();
        onEdit?.(product);
      },
      [onEdit, product],
    );

    const handleAddClick = useCallback(
      (e) => {
        e.stopPropagation();
        onAdd?.();
      },
      [onAdd],
    );

    const handleRemoveClick = useCallback(
      (e) => {
        e.stopPropagation();
        onRemove?.();
      },
      [onRemove],
    );

    const handleOpenProduct = useCallback(() => {
      onOpenProduct?.();
    }, [onOpenProduct]);

    return (
      <div
        className={`h-[420px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-xl group ${
          onOpenProduct ? "cursor-pointer" : ""
        }`}
        onClick={handleOpenProduct}
      >
        <div
          className="relative w-full overflow-hidden bg-gray-100"
          style={{ height: IMAGE_HEIGHT }}
        >
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold shadow">
            {product.stock} in stock
          </div>
          <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
            {PRODUCT_SUBCATEGORY_LABEL_MAP[product.subcategory] ||
              PRODUCT_CATEGORY_LABEL_MAP[product.category] ||
              product.category}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 font-semibold text-white">
              Out of Stock
            </div>
          )}
        </div>

        <div className="space-y-3 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-xs text-gray-500">
            {product.description || "Premium quality product."}
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold text-blue-600">
              Rs. {product.price}
            </span>

            <div className="flex items-center gap-2">
              {!isVendor && (
                <>
                  {!isOutOfStock && !isInCart && (
                    <button
                      onClick={handleAddClick}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  )}

                  {isInCart && !isOutOfStock && (
                    <div className="flex items-center overflow-hidden rounded-lg border border-blue-200 bg-blue-50">
                      <button
                        onClick={handleRemoveClick}
                        className="flex h-8 w-8 items-center justify-center hover:bg-blue-100"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="px-2 text-sm font-semibold">
                        {cartQty}
                      </span>

                      <button
                        onClick={handleAddClick}
                        className="flex h-8 w-8 items-center justify-center hover:bg-blue-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}

                  {product.vendor && (
                    <button
                      onClick={handleChatClick}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-gray-100"
                    >
                      <MessageCircle size={18} />
                    </button>
                  )}
                </>
              )}

              {isVendor && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProduct?.();
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-gray-100"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={handleEdit}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-gray-100"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white transition hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";
export default ProductCard;
