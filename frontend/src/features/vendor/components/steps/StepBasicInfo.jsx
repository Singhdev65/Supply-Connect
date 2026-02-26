import StepWrapper from "./StepWrapper";
import {
  PRODUCT_CATEGORY_META,
  PRODUCT_CATEGORY_OPTIONS,
  PRODUCT_SUBCATEGORY_OPTIONS,
} from "@/utils/constants";

const StepBasicInfo = ({ product, setProduct, errors = {}, setErrors }) => {
  const categoryMeta = PRODUCT_CATEGORY_META[product.category] || {};
  const subcategoryOptions = PRODUCT_SUBCATEGORY_OPTIONS[product.category] || [];

  return (
    <StepWrapper
      title="Basic Information"
      subtitle="Customers will see this first"
    >
      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            value={product.category}
            onChange={(e) => {
              const nextCategory = e.target.value;
              const nextSubcategory = PRODUCT_SUBCATEGORY_OPTIONS[nextCategory]?.[0]?.value || "";
              setProduct({ ...product, category: nextCategory, subcategory: nextSubcategory });
              setErrors((prev) => ({ ...prev, category: "", subcategory: "" }));
            }}
            className={`w-full mt-1 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none ${
              errors.category ? "bg-red-50 border border-red-200" : "bg-gray-100"
            }`}
          >
            {PRODUCT_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Subcategory</label>
          <select
            value={product.subcategory || subcategoryOptions[0]?.value || ""}
            onChange={(e) => {
              setProduct({ ...product, subcategory: e.target.value });
              setErrors((prev) => ({ ...prev, subcategory: "" }));
            }}
            className={`w-full mt-1 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none ${
              errors.subcategory ? "bg-red-50 border border-red-200" : "bg-gray-100"
            }`}
          >
            {subcategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.subcategory && (
            <p className="mt-1 text-xs text-red-600">{errors.subcategory}</p>
          )}
        </div>

        {/* NAME */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Product Name
          </label>

          <input
            value={product.name}
            onChange={(e) => {
              setProduct({ ...product, name: e.target.value });
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            className={`w-full mt-1 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none ${
              errors.name ? "bg-red-50 border border-red-200" : "bg-gray-100"
            }`}
            placeholder={categoryMeta.namePlaceholder || "Product name"}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            rows={4}
            value={product.description}
            onChange={(e) => {
              setProduct({
                ...product,
                description: e.target.value,
              });
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            className={`w-full mt-1 rounded-xl px-4 py-3 resize-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none ${
              errors.description ? "bg-red-50 border border-red-200" : "bg-gray-100"
            }`}
            placeholder={categoryMeta.descriptionPlaceholder || "Describe your product"}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>
      </div>
    </StepWrapper>
  );
};

export default StepBasicInfo;
