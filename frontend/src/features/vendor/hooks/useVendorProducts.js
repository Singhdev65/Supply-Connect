import { useEffect, useState, useCallback } from "react";
import {
  fetchVendorProductsApi,
  deleteVendorProductApi,
} from "@/features/vendor/api";

const useVendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchVendorProductsApi();
      setProducts(data?.data?.filter((product) => product.vendor) || []);
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
      await deleteVendorProductApi(id);
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
