import StepWrapper from "./StepWrapper";
import { Plus, Trash2 } from "lucide-react";

const VARIANT_FIELDS_BY_CATEGORY = {
  "grocery-daily-essentials": [
    { key: "brand", label: "Brand" },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: ["Organic", "Regular"],
    },
    { key: "packSize", label: "Weight / Pack Size" },
    { key: "grade", label: "Grade" },
  ],
  "fashion-apparel": [
    {
      key: "size",
      label: "Size",
      type: "select",
      options: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    { key: "color", label: "Color" },
    { key: "material", label: "Material" },
  ],
  electronics: [
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "ram", label: "RAM" },
    { key: "storage", label: "Storage" },
    { key: "color", label: "Color" },
  ],
  "books-stationery": [
    { key: "author", label: "Author" },
    { key: "publisher", label: "Publisher" },
    { key: "language", label: "Language" },
    { key: "edition", label: "Edition" },
  ],
  "home-living": [
    { key: "brand", label: "Brand" },
    { key: "material", label: "Material" },
    { key: "color", label: "Color" },
  ],
  "beauty-personal-care": [
    { key: "brand", label: "Brand" },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: ["Organic", "Regular", "Herbal", "Premium"],
    },
    { key: "material", label: "Ingredients / Material" },
  ],
  "toys-sports-baby-care": [
    { key: "brand", label: "Brand" },
    { key: "material", label: "Material" },
    { key: "color", label: "Color" },
    { key: "ageGroup", label: "Age Group" },
  ],
};

const getFields = (category) => VARIANT_FIELDS_BY_CATEGORY[category] || [];

const createEmptyVariant = () => ({
  stock: 0,
});

export default function StepVariants({ product, setProduct, errors = {}, setErrors }) {
  const fields = getFields(product.category);
  const variants = product.variants || [];

  const addVariant = () =>
    setProduct({
      ...product,
      variants: [...variants, createEmptyVariant()],
    });

  const updateVariant = (i, field, value) => {
    const nextVariants = [...variants];
    nextVariants[i][field] = value;
    setProduct({ ...product, variants: nextVariants });
    setErrors((prev) => ({ ...prev, variants: "" }));
  };

  const removeVariant = (i) =>
    setProduct({
      ...product,
      variants: variants.filter((_, idx) => idx !== i),
    });

  return (
    <StepWrapper
      title="Product Variants"
      subtitle="Add category-specific variant details"
    >
      <div className="space-y-5">
        {variants.map((variant, i) => (
          <div
            key={i}
            className="border rounded-2xl p-5 bg-gray-50 space-y-4 relative"
          >
            <button
              onClick={() => removeVariant(i)}
              className="absolute top-3 right-3 text-red-500 hover:bg-red-100 p-2 rounded-lg"
            >
              <Trash2 size={18} />
            </button>

            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-medium">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      value={variant[field.key] || ""}
                      onChange={(e) => updateVariant(i, field.key, e.target.value)}
                      className="w-full mt-1 rounded-xl px-4 py-3 bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={variant[field.key] || ""}
                      onChange={(e) => updateVariant(i, field.key, e.target.value)}
                      className="w-full mt-1 rounded-xl px-4 py-3 bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {errors.variants && <p className="text-xs text-red-600">{errors.variants}</p>}

        <button
          onClick={addVariant}
          className="w-full border-2 border-dashed border-blue-300 py-4 rounded-xl text-blue-600 hover:bg-blue-50 flex justify-center gap-2"
        >
          <Plus size={18} />
          Add Variant
        </button>
      </div>
    </StepWrapper>
  );
}
