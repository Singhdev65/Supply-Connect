import { Search, SlidersHorizontal, Truck, Zap } from "lucide-react";
import { PRODUCT_SORT_OPTIONS } from "@/utils/constants";

const BuyerToolbar = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  categoryOptions = [],
  selectedCategory,
  setSelectedCategory,
  productCount = 0,
}) => {
  return (
    <div className="sticky top-0 z-20 rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <Truck size={14} />
          Fast delivery ready
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          <Zap size={14} />
          {productCount} products available
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search groceries, electronics, books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-transparent bg-gray-100 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cursor-pointer appearance-none rounded-full border border-transparent bg-gray-100 py-3 pl-9 pr-8 text-sm outline-none transition hover:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value={PRODUCT_SORT_OPTIONS.NEWEST}>Newest Added</option>
            <option value={PRODUCT_SORT_OPTIONS.OLDEST}>Oldest Added</option>
            <option value={PRODUCT_SORT_OPTIONS.NAME}>Name</option>
            <option value={PRODUCT_SORT_OPTIONS.STOCK}>Stock</option>
          </select>
        </div>
      </div>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {categoryOptions.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory?.(category.value)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
              selectedCategory === category.value
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BuyerToolbar;
