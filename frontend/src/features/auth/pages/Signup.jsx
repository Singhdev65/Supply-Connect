import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { PATHS, USER_ROLES } from "@/utils/constants";
import { signupApi } from "@/features/auth/api";
import { loginStart, loginSuccess, loginFailure } from "@/features/auth/store/authSlice";
import { useAuthForm } from "@/features/auth/hooks";
import { AuthField } from "@/features/auth/components";
import { validateSignupForm } from "@/features/auth/utils/validators";
import { AppButton, AppCard } from "@/shared/ui";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useAuthForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: USER_ROLES.BUYER,
    },
    validate: validateSignupForm,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.markAllTouched();
    if (form.hasErrors) return;

    dispatch(loginStart());
    try {
      const res = await signupApi(form.values);
      dispatch(
        loginSuccess({
          token: res?.data?.token,
          user: res?.data?.user,
        }),
      );
      navigate(form.values.role === USER_ROLES.VENDOR ? PATHS.VENDOR_HOME : PATHS.BUYER_HOME);
    } catch (err) {
      dispatch(loginFailure());
      console.error("Signup failed", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form className="w-96" onSubmit={handleSubmit}>
        <AppCard className="p-8 shadow-xl">
          <h1 className="mb-6 text-center text-3xl font-bold">Signup</h1>

          <AuthField
            placeholder="Name"
            value={form.values.name}
            onChange={(e) => form.onFieldChange("name", e.target.value)}
            onBlur={() => form.onFieldBlur("name")}
            error={form.errors.name}
          />
          <AuthField
            placeholder="Email"
            value={form.values.email}
            onChange={(e) => form.onFieldChange("email", e.target.value)}
            onBlur={() => form.onFieldBlur("email")}
            error={form.errors.email}
          />
          <AuthField
            type="password"
            placeholder="Password"
            value={form.values.password}
            onChange={(e) => form.onFieldChange("password", e.target.value)}
            onBlur={() => form.onFieldBlur("password")}
            error={form.errors.password}
          />
          <AuthField error={form.errors.role}>
            <select
              className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 ${
                form.errors.role
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={form.values.role}
              onChange={(e) => form.onFieldChange("role", e.target.value)}
              onBlur={() => form.onFieldBlur("role")}
            >
              <option value={USER_ROLES.BUYER}>Buyer</option>
              <option value={USER_ROLES.VENDOR}>Vendor</option>
            </select>
          </AuthField>

          <AppButton type="submit" fullWidth className="mt-4">
            Signup
          </AppButton>
        </AppCard>
      </form>
    </div>
  );
};

export default Signup;
