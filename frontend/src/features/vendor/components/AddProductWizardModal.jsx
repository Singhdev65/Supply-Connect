import { useEffect } from "react";
import useVendorProductsWizard from "../hooks/useVendorProductsWizard";

import {
  StepBasicInfo,
  StepPricingStock,
  StepVariants,
  StepImages,
  StepReview,
} from "./steps";

/* ---------------- STEPS ---------------- */

const steps = [
  StepBasicInfo,
  StepPricingStock,
  StepVariants,
  StepImages,
  StepReview,
];

const AddProductWizardModal = ({ onClose, onSuccess, product }) => {
  const wizard = useVendorProductsWizard(onSuccess);

  /* ---------------- EDIT MODE ---------------- */

  useEffect(() => {
    if (product) {
      wizard.setProduct({
        ...product,
        bannerImages: product.bannerImages || product.images || [],
      });
    }
  }, [product, wizard.setProduct]);

  const Step = steps[wizard.step];

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    try {
      const result = await wizard.submit();
      onSuccess(result);
      onClose();
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-2 sm:p-6">
      {/* MODAL */}
      <div
        className="
          w-full
          max-w-4xl
          h-[95vh]
          bg-white
          rounded-2xl
          shadow-xl
          flex flex-col
          overflow-hidden
        "
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h1 className="text-lg font-semibold">
              {product ? "Edit Product" : "Add Product"}
            </h1>

            <p className="text-xs text-gray-500">
              Step {wizard.step + 1} of {steps.length}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* ================= STEP CONTENT ================= */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <Step {...wizard} />
        </div>

        {/* ================= FOOTER ================= */}
        <div className="border-t px-4 sm:px-6 py-4 bg-white flex items-center justify-between">
          <button
            onClick={wizard.prev}
            disabled={wizard.step === 0}
            className="
              px-4 py-2 rounded-lg
              bg-gray-100
              hover:bg-gray-200
              disabled:opacity-40
            "
          >
            Back
          </button>

          {wizard.step === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="
                px-6 py-2 rounded-lg
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                font-medium
                shadow-sm
              "
            >
              {product ? "Update Product" : "Publish Product"}
            </button>
          ) : (
            <button
              onClick={wizard.next}
              className="
                px-6 py-2 rounded-lg
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                font-medium
              "
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductWizardModal;
