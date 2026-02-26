const StepWrapper = ({ title, subtitle, children }) => {
  return (
    <div
      className="
        flex flex-col
        h-full
        min-h-0
        bg-white
        rounded-2xl
        shadow-sm
      "
    >
      {/* HEADER */}
      <div className="px-6 py-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">{children}</div>
    </div>
  );
};

export default StepWrapper;
