import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchProductReviewsApi,
  respondToReviewApi,
  upsertProductReviewApi,
} from "@/features/reviews/api";
import { USER_ROLES } from "@/utils/constants";

const initialForm = {
  rating: 5,
  title: "",
  comment: "",
};

const defaultSummary = {
  ratingAverage: 0,
  ratingCount: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

const useProductReviews = ({ productId, role, userId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [respondingReviewId, setRespondingReviewId] = useState(null);
  const [data, setData] = useState({
    summary: defaultSummary,
    reviews: [],
    viewerReviewId: null,
    canWriteReview: false,
    canWriteReviewReason: "",
  });

  const [reviewForm, setReviewForm] = useState(initialForm);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await fetchProductReviewsApi(productId);
      const payload = res?.data || {};
      setData({
        summary: payload.summary || defaultSummary,
        reviews: payload.reviews || [],
        viewerReviewId: payload.viewerReviewId || null,
        canWriteReview: Boolean(payload.canWriteReview),
        canWriteReviewReason: payload.canWriteReviewReason || "",
      });

      const ownReview = (payload.reviews || []).find(
        (review) => String(review.reviewer?._id) === String(userId),
      );
      if (ownReview) {
        setReviewForm({
          rating: ownReview.rating || 5,
          title: ownReview.title || "",
          comment: ownReview.comment || "",
        });
      } else {
        setReviewForm(initialForm);
      }
    } finally {
      setLoading(false);
    }
  }, [productId, userId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = useCallback(async () => {
    if (!productId) return;
    setSaving(true);
    try {
      await upsertProductReviewApi(productId, reviewForm);
      await fetchReviews();
    } finally {
      setSaving(false);
    }
  }, [fetchReviews, productId, reviewForm]);

  const respondToReview = useCallback(
    async (reviewId, payload) => {
      if (!reviewId) return;
      setRespondingReviewId(reviewId);
      try {
        await respondToReviewApi(reviewId, payload);
        await fetchReviews();
      } finally {
        setRespondingReviewId(null);
      }
    },
    [fetchReviews],
  );

  const canWriteReview = role === USER_ROLES.BUYER ? data.canWriteReview : false;
  const canRespond = role === USER_ROLES.VENDOR;

  const ownReview = useMemo(
    () => data.reviews.find((review) => String(review.reviewer?._id) === String(userId)),
    [data.reviews, userId],
  );

  return {
    loading,
    saving,
    respondingReviewId,
    summary: data.summary,
    reviews: data.reviews,
    viewerReviewId: data.viewerReviewId,
    canWriteReviewReason: data.canWriteReviewReason,
    reviewForm,
    setReviewForm,
    canWriteReview,
    canRespond,
    ownReview,
    submitReview,
    respondToReview,
    refreshReviews: fetchReviews,
  };
};

export default useProductReviews;
