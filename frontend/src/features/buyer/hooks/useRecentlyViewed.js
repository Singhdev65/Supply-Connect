import { useCallback, useEffect, useState } from "react";
import { fetchRecentlyViewedApi } from "@/features/buyer/api";

const useRecentlyViewed = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRecentlyViewedApi();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    items,
    loading,
    refresh: load,
  };
};

export default useRecentlyViewed;
