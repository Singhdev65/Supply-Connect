import React from "react";
import { Plus, Trash2 } from "lucide-react";

const COLORS = ["Red", "Blue", "Black", "White", "Green", "Yellow", "Gray"];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function StepVariants({ product, setProduct }) {
  const addVariant = () => {
    setProduct({
      ...product,
      variants: [...product.variants, { color: "", size: "", stock: 0 }],
    });
  };

  const updateVariant = (index, field, value) => {
    const variants = [...product.variants];
    variants[index][field] = value;

    setProduct({
      ...product,
      variants,
    });
  };

  const removeVariant = (index) => {
    const variants = product.variants.filter((_, i) => i !== index);

    setProduct({
      ...product,
      variants,
    });
  };

  const changeStock = (index, amount) => {
    const variants = [...product.variants];

    const newStock = Math.max(0, Number(variants[index].stock || 0) + amount);

    variants[index].stock = newStock;

    setProduct({
      ...product,
      variants,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Product Variants
        </h2>

        <p className="text-sm text-gray-500">
          Add available combinations of color, size and stock.
        </p>
      </div>

      <div className="space-y-4">
        {product.variants.map((variant, i) => (
          <div
            key={i}
            className="bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4"
          >
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Color</label>

              <select
                value={variant.color}
                onChange={(e) => updateVariant(i, "color", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Color</option>
                {COLORS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Size</label>

              <select
                value={variant.size}
                onChange={(e) => updateVariant(i, "size", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Size</option>
                {SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-48">
              <label className="text-xs text-gray-500 mb-1 block">Stock</label>

              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => changeStock(i, -1)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  −
                </button>

                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => updateVariant(i, "stock", e.target.value)}
                  className="w-full text-center outline-none"
                />

                <button
                  type="button"
                  onClick={() => changeStock(i, 1)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => removeVariant(i)}
              className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addVariant}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition shadow"
      >
        <Plus size={18} />
        Add Variant
      </button>
    </div>
  );
}
