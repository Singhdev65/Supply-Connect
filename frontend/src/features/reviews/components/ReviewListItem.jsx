import { memo, useState } from "react";
import ReviewStars from "./ReviewStars";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const VENDOR_REACTIONS = [
  { value: "none", label: "No reaction" },
  { value: "like", label: "Like" },
  { value: "love", label: "Love" },
  { value: "thanks", label: "Thanks" },
];

const ReviewListItem = ({
  review,
  canRespond,
  vendorOwnsProduct,
  respondingReviewId,
  onRespondReview,
}) => {
  const [replyDraft, setReplyDraft] = useState(review.vendorReply?.message || "");
  const [reactionDraft, setReactionDraft] = useState(review.vendorReaction || "none");

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {review.reviewer?.name || review.reviewer?.email || "Buyer"}
          </p>
          <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
        </div>
        <ReviewStars value={review.rating} />
      </div>

      {review.title && <p className="mt-2 text-sm font-medium text-gray-900">{review.title}</p>}
      {review.comment && <p className="mt-1 text-sm leading-6 text-gray-700">{review.comment}</p>}

      {(review.vendorReply?.message || review.vendorReaction !== "none") && (
        <div className="mt-3 rounded-lg bg-blue-50 p-3">
          <p className="text-xs uppercase tracking-wide text-blue-700">Vendor response</p>
          {review.vendorReply?.message && (
            <p className="mt-1 text-sm text-blue-900">{review.vendorReply.message}</p>
          )}
          {review.vendorReaction && review.vendorReaction !== "none" && (
            <p className="mt-1 text-xs font-medium text-blue-700">
              Reaction: {review.vendorReaction}
            </p>
          )}
        </div>
      )}

      {canRespond && vendorOwnsProduct && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            Reply / React
          </p>
          <textarea
            rows={3}
            value={replyDraft}
            onChange={(e) => setReplyDraft(e.target.value)}
            placeholder="Reply to this buyer review..."
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <select
              value={reactionDraft}
              onChange={(e) => setReactionDraft(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              {VENDOR_REACTIONS.map((reaction) => (
                <option key={reaction.value} value={reaction.value}>
                  {reaction.label}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                onRespondReview(review._id, {
                  replyMessage: replyDraft,
                  vendorReaction: reactionDraft,
                })
              }
              disabled={respondingReviewId === review._id}
              className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
            >
              {respondingReviewId === review._id ? "Saving..." : "Save response"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ReviewListItem);
