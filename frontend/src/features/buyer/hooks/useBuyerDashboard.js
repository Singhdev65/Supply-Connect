import { useState, useMemo } from "react";
import { useProducts } from "../../products/hooks";
import { PRODUCT_CATEGORY_OPTIONS, PRODUCT_SORT_OPTIONS } from "@/utils/constants";

const useBuyerDashboard = () => {
  const { products = [], loading, loadingMore, hasMore, loadMore } = useProducts();

  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(PRODUCT_SORT_OPTIONS.NEWEST);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "All" },
      ...PRODUCT_CATEGORY_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    ],
    [],
  );

  const categoryBanners = useMemo(() => {
    if (!products.length || selectedCategory === "all") return [];

    const urls = products
      .filter((product) => product.category === selectedCategory)
      .flatMap((product) => {
        const banners = product.bannerImages?.length ? product.bannerImages : product.images;
        return banners || [];
      });

    return [...new Set(urls)];
  }, [products, selectedCategory]);

  const displayedProducts = useMemo(() => {
    if (!products.length) return [];

    const filtered = products
      .filter((p) =>
        selectedCategory === "all" ? true : p.category === selectedCategory,
      )
      .filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return filtered.sort((a, b) => {
      if (sortBy === PRODUCT_SORT_OPTIONS.NAME) {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === PRODUCT_SORT_OPTIONS.STOCK) {
        return b.stock - a.stock;
      }
      if (sortBy === PRODUCT_SORT_OPTIONS.OLDEST) {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [products, searchTerm, selectedCategory, sortBy]);

  return {
    loading,
    loadingMore,
    hasMore,
    loadMore,
    categoryOptions,
    categoryBanners,
    selectedCategory,
    displayedProducts,
    showCart,
    searchTerm,
    sortBy,
    setSelectedCategory,
    setShowCart,
    setSearchTerm,
    setSortBy,
  };
};

export default useBuyerDashboard;
