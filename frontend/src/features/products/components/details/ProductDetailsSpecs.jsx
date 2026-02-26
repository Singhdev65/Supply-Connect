import { VARIANT_FIELD_LABELS } from "./constants";

const ProductDetailsSpecs = ({ variantDetails = [] }) => {
  if (!variantDetails.length) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900">Product Specifications</h3>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {variantDetails.map((item) => (
          <div
            key={item.field}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {VARIANT_FIELD_LABELS[item.field] || item.field}
            </span>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailsSpecs;
