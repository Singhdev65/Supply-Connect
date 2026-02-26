import StepWrapper from "./StepWrapper";
import { PRODUCT_CATEGORY_LABEL_MAP, PRODUCT_SUBCATEGORY_LABEL_MAP } from "@/utils/constants";

const StepReview = ({ product }) => {
  return (
    <StepWrapper title="Review Listing">
      <div className="space-y-6">
        <div className="border rounded-2xl bg-gray-50 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {product.images?.[0] && (
              <div className="md:w-1/2 p-4 bg-white flex justify-center">
                <div className="aspect-square w-full max-w-sm">
                  <img
                    src={product.images[0]}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            <div className="md:w-1/2 p-6 space-y-4">
              <h3 className="text-lg font-semibold break-words">
                {product.name}
              </h3>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {PRODUCT_SUBCATEGORY_LABEL_MAP[product.subcategory] ||
                  PRODUCT_CATEGORY_LABEL_MAP[product.category] ||
                  product.category}
              </p>

              {product.description && (
                <div className="max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-xl font-bold text-blue-600">
                  ₹ {product.price || 0}
                </span>

                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {product.stock || 0} in stock
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Banner images selected: {(product.bannerImages || []).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
};

export default StepReview;
