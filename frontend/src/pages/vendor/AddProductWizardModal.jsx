import { useEffect, useState } from "react";
import useVendorProductsWizard from "./useVendorProductsWizard";
import StepBasicInfo from "./steps/StepBasicInfo";
import StepPricingStock from "./steps/StepPricingStock";
import StepVariants from "./steps/StepVariants";
import StepImages from "./steps/StepImages";
import StepReview from "./steps/StepReview";

const steps = [
  StepBasicInfo,
  StepPricingStock,
  StepVariants,
  StepImages,
  StepReview,
];

const AddProductWizardModal = ({ onClose, onSuccess, product }) => {
  const wizard = useVendorProductsWizard(onSuccess);

  useEffect(() => {
    if (product) {
      wizard.setProduct({ ...product });
    }
  }, [product]);

  const Step = steps[wizard.step];

  const handleSubmit = async () => {
    try {
      const result = await wizard.submit();
      onSuccess(result);
      onClose();
    } catch (err) {
      console.error("Failed to submit product:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative">
        <Step {...wizard} />

        <div className="mt-6 flex justify-between">
          <button
            onClick={wizard.prev}
            disabled={wizard.step === 0}
            className="px-4 py-2 rounded-lg bg-gray-100"
          >
            Back
          </button>

          {wizard.step === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white"
            >
              {product ? "Update Product" : "Publish Product"}
            </button>
          ) : (
            <button
              onClick={wizard.next}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white"
            >
              Next
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-400"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AddProductWizardModal;
