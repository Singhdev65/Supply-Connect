import { useMemo } from "react";
import {
  validateProductForSubmit,
  validateProductStep,
} from "@/features/vendor/utils/productValidators";

const useVendorProductValidation = (step, product) => {
  const stepErrors = useMemo(() => validateProductStep(step, product), [step, product]);
  const submitErrors = useMemo(() => validateProductForSubmit(product), [product]);

  return {
    stepErrors,
    hasStepErrors: Object.values(stepErrors).some(Boolean),
    submitErrors,
    hasSubmitErrors: Object.values(submitErrors).some(Boolean),
  };
};

export default useVendorProductValidation;
