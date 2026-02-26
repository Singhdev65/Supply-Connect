import { useMemo } from "react";
import ReviewStars from "./ReviewStars";
import ReviewListItem from "./ReviewListItem";

const ProductReviewsSection = ({
  summary,
  reviews = [],
  loading,
  canWriteReview,
  canWriteReviewReason,
  canRespond,
  ownReview,
  reviewForm,
  setReviewForm,
  saving,
  respondingReviewId,
  onSubmitReview,
  onRespondReview,
  vendorOwnsProduct = false,
}) => {
  const distributionRows = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => {
        const count = Number(summary?.distribution?.[star] || 0);
        const total = Number(summary?.ratingCount || 0);
        const percent = total ? Math.round((count / total) * 100) : 0;
        return { star, count, percent };
      }),
    [summary],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900">Ratings & Reviews</h3>

      {loading ? (
        <p className="mt-3 text-sm text-gray-500">Loading reviews...</p>
      ) : (
        <>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-3xl font-bold text-gray-900">
                {Number(summary?.ratingAverage || 0).toFixed(1)}
              </p>
              <div className="mt-1">
                <ReviewStars value={summary?.ratingAverage || 0} />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {summary?.ratingCount || 0} verified ratings
              </p>
            </div>

            <div className="space-y-2 rounded-xl bg-gray-50 p-4 md:col-span-2">
              {distributionRows.map((row) => (
                <div key={row.star} className="flex items-center gap-2">
                  <span className="w-8 text-xs font-medium text-gray-600">{row.star}*</span>
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-amber-400"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-xs text-gray-500">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {canWriteReview ? (
            <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm font-semibold text-gray-900">
                {ownReview ? "Update your review" : "Write a review"}
              </p>
              <div className="mt-2">
                <ReviewStars
                  value={reviewForm.rating}
                  onChange={(rating) => setReviewForm((prev) => ({ ...prev, rating }))}
                />
              </div>
              <input
                value={reviewForm.title}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Title (optional)"
                className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                placeholder="Share product quality, packaging, delivery experience..."
                rows={4}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={onSubmitReview}
                disabled={saving}
                className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : ownReview ? "Update review" : "Submit review"}
              </button>
            </div>
          ) : !canRespond ? (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">Review locked</p>
              <p className="mt-1 text-sm text-amber-800">
                {canWriteReviewReason || "You can review this item after delivery."}
              </p>
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {reviews.length === 0 && (
              <p className="text-sm text-gray-500">No reviews yet. Be the first to review.</p>
            )}

            {reviews.map((review) => (
              <ReviewListItem
                key={review._id}
                review={review}
                canRespond={canRespond}
                vendorOwnsProduct={vendorOwnsProduct}
                respondingReviewId={respondingReviewId}
                onRespondReview={onRespondReview}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductReviewsSection;
