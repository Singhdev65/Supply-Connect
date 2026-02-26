import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { PATHS, USER_ROLES } from "@/utils/constants";
import { loginApi } from "@/features/auth/api";
import { useAuthForm } from "@/features/auth/hooks";
import { AuthField } from "@/features/auth/components";
import { validateLoginForm } from "@/features/auth/utils/validators";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/features/auth/store/authSlice";
import { AppButton, AppCard } from "@/shared/ui";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useAuthForm({
    initialValues: { email: "", password: "" },
    validate: validateLoginForm,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.markAllTouched();
    if (form.hasErrors) return;

    dispatch(loginStart());
    try {
      const res = await loginApi(form.values);
      dispatch(
        loginSuccess({
          token: res?.data?.token,
          user: res?.data?.user,
        }),
      );
      navigate(
        res?.data?.user?.role === USER_ROLES.VENDOR
          ? PATHS.VENDOR_HOME
          : PATHS.BUYER_HOME,
      );
    } catch (err) {
      dispatch(loginFailure());
      console.error("Login failed", err);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form className="w-96" onSubmit={handleSubmit}>
        <AppCard className="flex flex-col p-8 shadow-xl">
          <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Login</h1>

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

          <AppButton type="submit" fullWidth className="mb-4">
            Login
          </AppButton>

          <div className="text-center">
            <button
              type="button"
              className="font-medium text-blue-600 underline hover:text-blue-800"
              onClick={() => navigate(PATHS.SIGNUP)}
            >
              Don&apos;t have an account? Sign up
            </button>
          </div>
        </AppCard>
      </form>
    </div>
  );
};

export default Login;
