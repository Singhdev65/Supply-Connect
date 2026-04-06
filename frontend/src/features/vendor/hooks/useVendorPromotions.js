import { useCallback, useEffect, useState } from "react";
import {
  archiveVendorPromotionApi,
  createVendorPromotionApi,
  fetchVendorPromotionsApi,
  toggleVendorPromotionApi,
  updateVendorPromotionApi,
} from "@/features/vendor/api";

const emptyForm = {
  title: "",
  description: "",
  code: "",
  discountType: "percentage",
  discountValue: 10,
  maxDiscount: 0,
  minOrderValue: 0,
  scope: "all",
  productIds: [],
  categories: [],
  usageLimit: 0,
  perUserLimit: 1,
  startsAt: "",
  endsAt: "",
  isActive: true,
  autoApply: false,
};

const useVendorPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchVendorPromotionsApi();
      setPromotions(res?.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startCreate = useCallback(() => {
    setEditingId("");
    setForm(emptyForm);
  }, []);

  const startEdit = useCallback((promotion) => {
    setEditingId(promotion?._id || "");
    setForm({
      title: promotion?.title || "",
      description: promotion?.description || "",
      code: promotion?.code || "",
      discountType: promotion?.discountType || "percentage",
      discountValue: Number(promotion?.discountValue || 0),
      maxDiscount: Number(promotion?.maxDiscount || 0),
      minOrderValue: Number(promotion?.minOrderValue || 0),
      scope: promotion?.scope || "all",
      productIds: promotion?.productIds || [],
      categories: promotion?.categories || [],
      usageLimit: Number(promotion?.usageLimit || 0),
      perUserLimit: Number(promotion?.perUserLimit || 1),
      startsAt: promotion?.startsAt ? String(promotion.startsAt).slice(0, 16) : "",
      endsAt: promotion?.endsAt ? String(promotion.endsAt).slice(0, 16) : "",
      isActive: Boolean(promotion?.isActive),
      autoApply: Boolean(promotion?.autoApply),
    });
  }, []);

  const savePromotion = useCallback(async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        code: String(form.code || "").toUpperCase(),
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : new Date().toISOString(),
        endsAt: form.endsAt
          ? new Date(form.endsAt).toISOString()
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      if (editingId) {
        await updateVendorPromotionApi(editingId, payload);
      } else {
        await createVendorPromotionApi(payload);
      }
      await load();
      setEditingId("");
      setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  }, [editingId, form, load]);

  const togglePromotion = useCallback(async (promotionId) => {
    await toggleVendorPromotionApi(promotionId);
    await load();
  }, [load]);

  const archivePromotion = useCallback(async (promotionId) => {
    await archiveVendorPromotionApi(promotionId);
    await load();
  }, [load]);

  return {
    promotions,
    loading,
    saving,
    editingId,
    form,
    setForm,
    startCreate,
    startEdit,
    savePromotion,
    togglePromotion,
    archivePromotion,
    refresh: load,
  };
};

export default useVendorPromotions;
