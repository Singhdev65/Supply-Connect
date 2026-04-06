import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPasswordApi } from "@/features/auth/api";
import { loginSuccess } from "@/features/auth/store/authSlice";
import { PATHS, USER_ROLES } from "@/utils/constants";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!token || !password) return;

    setSubmitting(true);
    setMessage("");
    try {
      const res = await resetPasswordApi({ token, password });
      const authData = res?.data;
      dispatch(
        loginSuccess({
          token: authData?.token,
          user: authData?.user,
        }),
      );
      navigate(
        authData?.user?.role === USER_ROLES.VENDOR ? PATHS.VENDOR_HOME : PATHS.BUYER_HOME,
      );
    } catch {
      setMessage("Invalid or expired token.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-slate-900">Reset Password</h1>
        <input
          type="text"
          placeholder="Reset token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
        {message ? <p className="text-sm text-red-600">{message}</p> : null}
      </form>
    </div>
  );
};

export default ResetPassword;
