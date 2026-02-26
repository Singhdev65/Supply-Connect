const EmptyState = ({ icon: Icon, title, description, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {Icon ? <Icon size={56} className="mb-4 text-gray-300" /> : null}
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      {description ? <p className="mt-2 text-gray-500">{description}</p> : null}
    </div>
  );
};

export default EmptyState;

