const AuthField = ({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  children,
}) => {
  return (
    <div className="mb-3">
      {label && <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>}
      {children || (
        <input
          className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 ${
            error ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500"
          }`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default AuthField;
