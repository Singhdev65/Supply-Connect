import { VARIANT_FIELD_LABELS } from "./constants";

const ProductDetailsOptions = ({
  selectableFields = [],
  selectedOptions = {},
  variantOptions = {},
  onSelectOption,
}) => {
  if (!selectableFields.length) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900">Choose Options</h3>
      <div className="mt-4 space-y-4">
        {selectableFields.map((field) => (
          <div key={field}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              {VARIANT_FIELD_LABELS[field] || field}
            </p>
            <div className="flex flex-wrap gap-2">
              {(variantOptions[field] || []).map((option) => (
                <button
                  key={option}
                  onClick={() => onSelectOption(field, option)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    selectedOptions[field] === option
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailsOptions;
