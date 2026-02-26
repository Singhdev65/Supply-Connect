const VARIANT_CLASS_MAP = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  warning: "bg-[#ffd814] text-gray-900 hover:bg-[#f7ca00]",
};

const AppButton = ({
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  className = "",
  onClick,
  children,
}) => {
  const variantClass = VARIANT_CLASS_MAP[variant] || VARIANT_CLASS_MAP.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClass} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default AppButton;

