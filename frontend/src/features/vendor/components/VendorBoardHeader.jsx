import { PRODUCT_SORT_OPTIONS } from "@/utils/constants";

const TABS = [
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "analytics", label: "Analytics" },
  { id: "promotions", label: "Promotions" },
  { id: "finance", label: "Finance" },
];

const VendorBoardHeader = ({
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  onCreateProduct,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 rounded-xl bg-white p-1 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeTab === tab.id ? "bg-indigo-600 text-white" : "text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "products" && (
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value={PRODUCT_SORT_OPTIONS.NEWEST}>Newest Added</option>
            <option value={PRODUCT_SORT_OPTIONS.OLDEST}>Oldest Added</option>
            <option value={PRODUCT_SORT_OPTIONS.NAME}>Name</option>
          </select>
          <button
            onClick={onCreateProduct}
            className="rounded-xl bg-indigo-600 px-6 py-2 text-white shadow"
          >
            + Add Product
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorBoardHeader;
