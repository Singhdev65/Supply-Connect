import { Star } from "lucide-react";

const ReviewStars = ({ value = 0, onChange, size = 16 }) => {
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= Number(value || 0);
        const activeClass = active ? "fill-amber-400 text-amber-400" : "text-gray-300";

        if (!onChange) {
          return <Star key={star} size={size} className={`transition ${activeClass}`} />;
        }

        return (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="rounded focus:outline-none"
          >
            <Star size={size} className={`transition ${activeClass}`} />
          </button>
        );
      })}
    </div>
  );
};

export default ReviewStars;
