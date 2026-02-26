import { ChevronRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Breadcrumbs = ({ items = [], showBack = false, backLabel = "Back", className = "" }) => {
  const navigate = useNavigate();

  if (!items.length && !showBack) return null;

  return (
    <div className={`mb-4 flex flex-wrap items-center gap-2 text-sm ${className}`}>
      {showBack && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeft size={15} />
          {backLabel}
        </button>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
            {item.to && !isLast ? (
              <Link to={item.to} className="text-gray-600 hover:text-gray-900">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-semibold text-gray-900" : "text-gray-600"}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
