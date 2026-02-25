import { useState, useContext } from "react";
import { Grid, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";

import ProductCard from "../../components/ProductCard";
import AddProductWizardModal from "./AddProductWizardModal";
import ChatWindow from "../../components/ChatWindow";
import useVendorProducts from "./useVendorProducts";
import { AuthContext } from "../../context/AuthContext";

const ITEM_HEIGHT = 380;

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);

  const [showWizard, setShowWizard] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const {
    products,
    loading,
    deleteProduct,
    addProductLocal,
    updateProductLocal,
  } = useVendorProducts();

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowWizard(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 flex justify-end space-x-4">
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowWizard(true);
          }}
          className="px-6 py-2 rounded-xl bg-indigo-600 text-white shadow"
        >
          + Add Product
        </button>
      </div>

      {!loading && (
        <div className="h-[700px] px-4">
          <AutoSizer>
            {({ width, height }) => {
              const columns =
                width < 640 ? 1 : width < 1024 ? 2 : width < 1280 ? 3 : 4;
              const columnWidth = Math.floor(width / columns);
              const rows = Math.ceil(products.length / columns);

              return (
                <Grid
                  width={width}
                  height={height}
                  columnCount={columns}
                  columnWidth={columnWidth}
                  rowCount={rows}
                  rowHeight={ITEM_HEIGHT}
                  cellRenderer={({ columnIndex, rowIndex, key, style }) => {
                    const index = rowIndex * columns + columnIndex;
                    if (!products[index]) return null;

                    return (
                      <div key={key} style={{ ...style, padding: 8 }}>
                        <ProductCard
                          product={products[index]}
                          deleteProduct={deleteProduct}
                          onEdit={handleEdit}
                          isVendor
                        />
                      </div>
                    );
                  }}
                />
              );
            }}
          </AutoSizer>
        </div>
      )}

      {showWizard && (
        <AddProductWizardModal
          product={editingProduct}
          onClose={() => setShowWizard(false)}
          onSuccess={(p) => {
            if (editingProduct) {
              updateProductLocal(p);
            } else {
              addProductLocal(p);
            }
            setShowWizard(false);
          }}
        />
      )}
    </div>
  );
};

export default VendorDashboard;
