import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "./constants";

const ProductDetailsHeader = ({ category, subcategory, name, description }) => {
  const categoryLabel = CATEGORY_LABELS[category] || category;
  const subcategoryLabel = SUBCATEGORY_LABELS[subcategory] || subcategory;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {subcategoryLabel || categoryLabel}
      </p>
      {subcategoryLabel && categoryLabel ? (
        <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-400">
          {categoryLabel}
        </p>
      ) : null}
      <h1 className="mt-1 text-2xl font-semibold text-gray-900">{name}</h1>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description || "No description provided."}
      </p>
    </div>
  );
};

export default ProductDetailsHeader;
