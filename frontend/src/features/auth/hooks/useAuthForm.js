import { useMemo, useState } from "react";
import { useFormValidation } from "@/shared/hooks";

const useAuthForm = ({ initialValues, validate }) => {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const { errors, hasErrors } = useFormValidation(values, validate);

  const visibleErrors = useMemo(() => {
    const result = {};
    Object.keys(errors).forEach((key) => {
      if (touched[key]) result[key] = errors[key];
    });
    return result;
  }, [errors, touched]);

  const onFieldChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const onFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const markAllTouched = () => {
    const nextTouched = {};
    Object.keys(values).forEach((key) => {
      nextTouched[key] = true;
    });
    setTouched(nextTouched);
  };

  return {
    values,
    errors: visibleErrors,
    hasErrors,
    onFieldChange,
    onFieldBlur,
    markAllTouched,
  };
};

export default useAuthForm;
