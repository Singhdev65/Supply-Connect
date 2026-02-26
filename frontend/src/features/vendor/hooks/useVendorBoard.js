import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCT_SORT_OPTIONS, buildVendorProductDetailsPath } from "@/utils/constants";
import useVendorOrders from "./useVendorOrders";
import useVendorProducts from "./useVendorProducts";

const useVendorBoard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [sortBy, setSortBy] = useState(PRODUCT_SORT_OPTIONS.NEWEST);
  const [showWizard, setShowWizard] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const productsState = useVendorProducts();
  const ordersState = useVendorOrders();

  const sortedProducts = useMemo(() => {
    const list = [...productsState.products];
    return list.sort((a, b) => {
      if (sortBy === PRODUCT_SORT_OPTIONS.OLDEST) {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === PRODUCT_SORT_OPTIONS.NAME) {
        return (a.name || "").localeCompare(b.name || "");
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [productsState.products, sortBy]);

  const openCreateWizard = () => {
    setEditingProduct(null);
    setShowWizard(true);
  };

  const openEditWizard = (product) => {
    setEditingProduct(product);
    setShowWizard(true);
  };

  const closeWizard = () => setShowWizard(false);
  const openProductDetails = (product) => {
    if (!product?._id) return;
    navigate(buildVendorProductDetailsPath(product._id));
  };

  const commitWizardSuccess = (product) => {
    if (editingProduct) {
      productsState.updateProductLocal(product);
    } else {
      productsState.addProductLocal(product);
    }
    closeWizard();
  };

  return {
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    showWizard,
    editingProduct,
    sortedProducts,
    openCreateWizard,
    openEditWizard,
    closeWizard,
    commitWizardSuccess,
    openProductDetails,
    ...productsState,
    ...ordersState,
  };
};

export default useVendorBoard;
