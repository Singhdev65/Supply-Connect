import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductByIdApi } from "@/features/products/api";
import {
  addToWishlistApi,
  fetchWishlistApi,
  markRecentlyViewedApi,
  removeFromWishlistApi,
} from "@/features/buyer/api";
import { useCart } from "@/features/cart";
import { useChat } from "@/features/chat";
import { useAuth } from "@/shared/hooks";
import { PATHS } from "@/utils/constants";

const VARIANT_FIELD_ORDER = [
  "size",
  "color",
  "material",
  "type",
  "packSize",
  "grade",
  "brand",
  "model",
  "ram",
  "storage",
  "language",
  "edition",
  "author",
  "publisher",
];

const useProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startChat } = useChat(user?.id);
  const { cart, addToCart, removeFromCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetchProductByIdApi(id);
        const nextProduct = res?.data;
        if (!mounted) return;

        setProduct(nextProduct);
        const firstBanner = nextProduct?.bannerImages?.[0];
        const firstImage = nextProduct?.images?.[0];
        setActiveImage(firstBanner || firstImage || "");

        if (user?.role === "buyer" && nextProduct?._id) {
          markRecentlyViewedApi(nextProduct._id).catch(() => {});
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id, user?.role]);

  useEffect(() => {
    if (user?.role !== "buyer" || !product?._id) return;

    let mounted = true;
    const syncWishlist = async () => {
      try {
        const items = await fetchWishlistApi();
        if (!mounted) return;
        setIsWishlisted(items.some((entry) => String(entry._id) === String(product._id)));
      } catch {
        if (mounted) setIsWishlisted(false);
      }
    };

    syncWishlist();
    return () => {
      mounted = false;
    };
  }, [product?._id, user?.role]);

  const variants = product?.variants || [];

  const selectableFields = useMemo(() => {
    if (!variants.length) return [];
    return VARIANT_FIELD_ORDER.filter((field) =>
      variants.some((variant) => String(variant?.[field] || "").trim()),
    );
  }, [variants]);

  useEffect(() => {
    if (!variants.length || !selectableFields.length) return;
    const seed = {};
    selectableFields.forEach((field) => {
      const firstValue = variants.find((variant) => String(variant?.[field] || "").trim())?.[field];
      if (firstValue) seed[field] = firstValue;
    });
    setSelectedOptions(seed);
  }, [variants, selectableFields]);

  const matchingVariants = useMemo(() => {
    if (!variants.length) return [];
    return variants.filter((variant) =>
      selectableFields.every((field) => {
        const selected = selectedOptions[field];
        if (!selected) return true;
        return String(variant?.[field] || "") === String(selected);
      }),
    );
  }, [variants, selectableFields, selectedOptions]);

  const selectedVariant = matchingVariants[0] || variants[0] || null;

  const variantOptions = useMemo(() => {
    const map = {};
    selectableFields.forEach((field) => {
      map[field] = [
        ...new Set(
          variants
            .map((variant) => String(variant?.[field] || "").trim())
            .filter(Boolean),
        ),
      ];
    });
    return map;
  }, [variants, selectableFields]);

  const variantDetails = useMemo(() => {
    if (!selectedVariant) return [];
    return VARIANT_FIELD_ORDER
      .map((field) => ({
        field,
        value: String(selectedVariant[field] || "").trim(),
      }))
      .filter((item) => item.value);
  }, [selectedVariant]);

  const cartQty = cart.find((item) => item._id === product?._id)?.qty || 0;

  const goBackToBoard = useCallback(() => {
    if (user?.role === "vendor") {
      navigate(PATHS.VENDOR_HOME);
      return;
    }
    navigate(PATHS.BUYER_HOME);
  }, [navigate, user?.role]);

  const handleStartChat = useCallback(async () => {
    if (!product?.vendor?._id) return;
    const conversation = await startChat(product.vendor._id);
    if (conversation?._id) {
      navigate(PATHS.CHAT, { state: { conversationId: conversation._id } });
    }
  }, [navigate, product?.vendor?._id, startChat]);

  const toggleWishlist = useCallback(async () => {
    if (!product?._id || user?.role !== "buyer") return;
    if (isWishlisted) {
      await removeFromWishlistApi(product._id);
      setIsWishlisted(false);
      return;
    }
    await addToWishlistApi(product._id);
    setIsWishlisted(true);
  }, [isWishlisted, product?._id, user?.role]);

  return {
    loading,
    product,
    activeImage,
    setActiveImage,
    selectedOptions,
    setSelectedOptions,
    selectableFields,
    variantOptions,
    variantDetails,
    cartQty,
    addToCart,
    removeFromCart,
    goBackToBoard,
    handleStartChat,
    isWishlisted,
    toggleWishlist,
    userRole: user?.role,
    userId: user?.id,
  };
};

export default useProductDetails;
