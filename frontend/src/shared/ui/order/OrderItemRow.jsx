import { BlurImage } from "@/shared/ui";
import { formatCurrency } from "@/features/orders/utils/formatters";

const OrderItemRow = ({
  item,
  compact = false,
  showReviewAction = false,
  onReviewAction,
}) => {
  const name = item.product?.name || item.name || "Product";
  const image = item.product?.images?.[0] || item.image;
  const qty = Number(item.qty || 0);
  const price = Number(item.price || 0);
  const vendorName = item.vendor?.name || item.product?.vendor?.name;

  return (
    <div className={`flex items-center gap-4 border-b p-4 last:border-b-0 ${compact ? "" : "sm:p-5"}`}>
      <BlurImage
        src={image}
        alt={name}
        className={`${compact ? "h-16 w-16" : "h-20 w-20"} rounded-xl border`}
      />

      <div className="flex-1">
        <h3 className={`${compact ? "text-base" : "text-lg"} font-semibold text-gray-900`}>{name}</h3>
        {vendorName ? <p className="text-xs text-gray-500">Sold by {vendorName}</p> : null}
        <p className="text-sm text-gray-500">
          Qty {qty} - {formatCurrency(price)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <p className={`${compact ? "text-base" : "text-lg"} font-semibold text-gray-900`}>
          {formatCurrency(qty * price)}
        </p>
        {showReviewAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReviewAction?.();
            }}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          >
            Rate & Review
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderItemRow;
