import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { PATHS, USER_ROLES } from "@/utils/constants";
import { signupApi } from "@/features/auth/api";
import { loginStart, loginSuccess, loginFailure } from "@/features/auth/store/authSlice";
import { useAuthForm } from "@/features/auth/hooks";
import { validateSignupForm } from "@/features/auth/utils/validators";

// Google Icon SVG component
const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="white">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
  </svg>
);

// Facebook Icon SVG component
const FacebookIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="white">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
  </svg>
);

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
    <div className="flex min-h-screen items-center justify-center bg-[#eef1f5] p-4 sm:p-8">
      {/* Main Outer Container */}
      <div className="flex w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-xl min-h-[600px]">
        
        {/* Left Side - Branding (Hidden on smaller screens) */}
        <div 
          className="hidden w-1/2 flex-col items-center justify-center bg-[#007bff] bg-cover bg-center md:flex relative"
          style={{ backgroundImage: 'url("/big-bazzar-bg.png")' }}
        >
          {/* Overlay to ensure blue color if bg image is primarily white/transparent or subtle */}
          <div className="absolute inset-0 bg-[#007bff]/80 mix-blend-multiply pointer-events-none"></div>
          
          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white flex items-center gap-2">
              Supply Connect
            </h1>
            {/* Simple geometric element mimicking the logo underline/swoosh */}
            <div className="mx-auto mt-1 h-1 w-16 bg-white/80 rounded-full"></div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex w-full flex-col justify-center px-8 py-10 sm:px-12 md:w-1/2 lg:px-16">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
            <p className="mt-1 text-sm text-gray-500 mb-6">Create your account</p>

            {/* Social Buttons (Hidden)
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center rounded-md bg-[#4285f4] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3367d6] transition-colors shadow-sm">
                <GoogleIcon />
                Sign in with Google
              </button>
              <button className="flex items-center justify-center rounded-md bg-[#3b5998] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2d4373] transition-colors shadow-sm">
                <FacebookIcon />
                Sign in with Facebook
              </button>
            </div>
            */}

            {/* Divider (Hidden) 
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-xs text-gray-400 font-medium">Or Sign Up with</span>
              </div>
            </div>
            */}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Form Input Box Container */}
              <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                
                <div className="px-5 py-3 border-b border-gray-100">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.values.name}
                    onChange={(e) => form.onFieldChange("name", e.target.value)}
                    onBlur={() => form.onFieldBlur("name")}
                    className="w-full border-0 p-0 text-sm text-gray-900 focus:ring-0 placeholder-gray-400"
                  />
                  {form.errors.name && <p className="mt-1 text-xs text-red-500">{form.errors.name}</p>}
                </div>

                <div className="px-5 py-3 border-b border-gray-100">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="mail@gmail.com"
                    value={form.values.email}
                    onChange={(e) => form.onFieldChange("email", e.target.value)}
                    onBlur={() => form.onFieldBlur("email")}
                    className="w-full border-0 p-0 text-sm text-gray-900 focus:ring-0 placeholder-gray-400"
                  />
                  {form.errors.email && <p className="mt-1 text-xs text-red-500">{form.errors.email}</p>}
                </div>
                
                <div className="px-5 py-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.values.password}
                    onChange={(e) => form.onFieldChange("password", e.target.value)}
                    onBlur={() => form.onFieldBlur("password")}
                    className="w-full border-0 p-0 text-sm focus:ring-0 tracking-widest text-gray-900 placeholder-gray-400"
                  />
                  {form.errors.password && <p className="mt-1 text-xs text-red-500">{form.errors.password}</p>}
                </div>
              </div>

              {/* Role Selection Container */}
              <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-5 py-3 flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-600 w-1/3">I am a</label>
                  <select
                     value={form.values.role}
                     onChange={(e) => form.onFieldChange("role", e.target.value)}
                     onBlur={() => form.onFieldBlur("role")}
                     className="w-2/3 border-0 p-0 text-sm text-gray-900 focus:ring-0 text-right font-medium bg-transparent cursor-pointer"
                  >
                     <option value={USER_ROLES.BUYER}>Buyer</option>
                     <option value={USER_ROLES.VENDOR}>Vendor</option>
                  </select>
                </div>
                 {form.errors.role && <p className="px-5 pb-2 text-xs text-red-500">{form.errors.role}</p>}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                 <button
                  type="submit"
                  className="w-full rounded-md bg-[#007bff] py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#0069d9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2"
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => navigate(PATHS.LOGIN)}
                  className="w-full rounded-md border border-[#007bff] bg-white py-2.5 text-sm font-medium text-[#007bff] shadow-sm hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2"
                >
                  Sign In
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
