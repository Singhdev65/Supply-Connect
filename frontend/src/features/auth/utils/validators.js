const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginForm = (values) => {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Enter a valid email";
  }

  if (!values.password?.trim()) {
    errors.password = "Password is required";
  } else if (values.password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

export const validateSignupForm = (values) => {
  const errors = validateLoginForm(values);

  if (!values.name?.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!values.role) {
    errors.role = "Role is required";
  }

  return errors;
};
