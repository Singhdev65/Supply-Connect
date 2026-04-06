import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "@/features/auth/api";
import { PATHS } from "@/utils/constants";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tokenPreview, setTokenPreview] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setMessage("");
    try {
      const res = await forgotPasswordApi({ email });
      const payload = res?.data || {};
      setTokenPreview(payload.resetTokenPreview || "");
      setMessage("If this email exists, reset instructions were generated.");
    } catch {
      setMessage("Unable to process request right now.");
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
        <h1 className="text-xl font-semibold text-slate-900">Forgot Password</h1>
        <p className="text-sm text-slate-600">
          Enter your account email and we will generate a secure reset token.
        </p>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Generating..." : "Generate Reset Token"}
        </button>
        {message ? <p className="text-sm text-slate-700">{message}</p> : null}
        {tokenPreview ? (
          <div className="rounded-md bg-amber-50 p-3 text-xs text-amber-900">
            Dev token preview: <span className="font-semibold">{tokenPreview}</span>
          </div>
        ) : null}
        <Link to={PATHS.LOGIN} className="block text-center text-sm text-blue-600">
          Back to login
        </Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
