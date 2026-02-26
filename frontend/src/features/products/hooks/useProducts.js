import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isFeatureEnabled } from "@/app/config/featureFlags";
import {
  fetchProducts,
  updateStock,
} from "@/features/products/store/productsSlice";
import { socket } from "@/utils/socket";

const useProducts = () => {
  const dispatch = useDispatch();
  const productsEnabled = isFeatureEnabled("products");
  const { items, loading, loadingMore, meta, error } = useSelector(
    (state) =>
      state.products || {
        items: [],
        loading: false,
        loadingMore: false,
        meta: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: true },
        error: null,
      },
  );

  useEffect(() => {
    if (!productsEnabled) return undefined;

    dispatch(fetchProducts({ page: 1, limit: 20 }));

    const onStockUpdated = (data) => {
      dispatch(updateStock(data));
    };

    socket.on("stockUpdated", onStockUpdated);

    return () => socket.off("stockUpdated", onStockUpdated);
  }, [dispatch, productsEnabled]);

  const loadMore = useCallback(() => {
    if (!productsEnabled || loading || loadingMore || !meta?.hasMore) return;
    dispatch(
      fetchProducts({
        page: Number(meta.page || 1) + 1,
        limit: Number(meta.limit || 20),
        append: true,
      }),
    );
  }, [dispatch, loading, loadingMore, meta?.hasMore, meta?.limit, meta?.page, productsEnabled]);

  return {
    products: items || [],
    loading: productsEnabled ? loading : false,
    loadingMore: productsEnabled ? loadingMore : false,
    hasMore: productsEnabled ? Boolean(meta?.hasMore) : false,
    loadMore,
    error,
  };
};

export default useProducts;
