import { PRODUCT_CATEGORY_LABEL_MAP } from "@/utils/constants";

const BuyerCategoryBannerStrip = ({ category = "", banners = [] }) => {
  if (!banners.length) return null;
  const label = PRODUCT_CATEGORY_LABEL_MAP[category] || category;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label} banner
      </div>
      <div className="flex gap-3">
        {banners.map((imageUrl) => (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={`${label} banner`}
            className="h-28 w-48 flex-shrink-0 rounded-xl object-cover"
          />
        ))}
      </div>
    </div>
  );
};

export default BuyerCategoryBannerStrip;
