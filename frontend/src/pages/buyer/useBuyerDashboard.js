import { useState, useMemo } from "react";
import useProducts from "../../hooks/useProducts";

const useBuyerDashboard = () => {
  const { products = [], loading } = useProducts();

  const [showCart, setShowCart] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const displayedProducts = useMemo(() => {
    if (!products.length) return [];

    const filtered = products.filter((p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return b.stock - a.stock;
    });
  }, [products, searchTerm, sortBy]);

  return {
    loading,
    displayedProducts,
    showCart,
    showChat,
    searchTerm,
    sortBy,
    setShowCart,
    setShowChat,
    setSearchTerm,
    setSortBy,
  };
};

export default useBuyerDashboard;
