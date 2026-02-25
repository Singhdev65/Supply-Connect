import { useEffect, useState, useCallback } from "react";
import API from "../../api/api";

const useVendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data?.data.filter((p) => p.vendor));
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const addProductLocal = (product) => {
    setProducts((p) => [...p, product]);
  };

  const updateProductLocal = (product) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === product._id ? product : p)),
    );
  };

  return {
    products,
    loading,
    deleteProduct,
    addProductLocal,
    updateProductLocal,
  };
};

export default useVendorProducts;
