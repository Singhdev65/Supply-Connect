import { useMemo } from "react";

const useFormValidation = (values, validate) => {
  const errors = useMemo(() => validate(values), [validate, values]);

  const hasErrors = useMemo(
    () => Object.values(errors).some(Boolean),
    [errors],
  );

  return {
    errors,
    hasErrors,
  };
};

export default useFormValidation;
