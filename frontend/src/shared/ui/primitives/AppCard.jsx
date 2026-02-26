const AppCard = ({ className = "", children }) => {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default AppCard;

