import { useCallback, useEffect, useState } from "react";
import {
  fetchWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
} from "@/features/buyer/api";

const useWishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWishlistApi();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (productId) => {
    if (!productId) return;
    const data = await addToWishlistApi(productId);
    setItems(Array.isArray(data) ? data : []);
  }, []);

  const remove = useCallback(async (productId) => {
    if (!productId) return;
    const data = await removeFromWishlistApi(productId);
    setItems(Array.isArray(data) ? data : []);
  }, []);

  const has = useCallback(
    (productId) => items.some((item) => String(item._id) === String(productId)),
    [items],
  );

  return {
    items,
    loading,
    add,
    remove,
    has,
    refresh: load,
  };
};

export default useWishlist;
