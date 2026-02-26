import StepWrapper from "./StepWrapper";
import { PRODUCT_CATEGORY_META } from "@/utils/constants";

const StepPricingStock = ({ product, setProduct, errors = {}, setErrors }) => {
  const categoryMeta = PRODUCT_CATEGORY_META[product.category] || {};

  return (
    <StepWrapper title="Pricing & Inventory">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium">{categoryMeta.pricingLabel || "Price"}</label>

          <input
            type="number"
            value={product.price}
            onChange={(e) => {
              setProduct({ ...product, price: e.target.value });
              setErrors((prev) => ({ ...prev, price: "" }));
            }}
            className={`w-full mt-1 rounded-xl px-4 py-3 focus:bg-white outline-none ${
              errors.price ? "bg-red-50 border border-red-200" : "bg-gray-100"
            }`}
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Available Stock</label>

          <input
            type="number"
            value={product.stock}
            onChange={(e) => {
              setProduct({ ...product, stock: e.target.value });
              setErrors((prev) => ({ ...prev, stock: "" }));
            }}
            className={`w-full mt-1 rounded-xl px-4 py-3 focus:bg-white outline-none ${
              errors.stock ? "bg-red-50 border border-red-200" : "bg-gray-100"
            }`}
          />
          {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
        </div>
      </div>
    </StepWrapper>
  );
};

export default StepPricingStock;
