import { Sparkles, Store, Layers } from "lucide-react";

const BuyerHeroBoard = ({ productCount = 0, categoryCount = 0 }) => {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 p-5 text-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
            <Sparkles size={14} />
            Smart Marketplace
          </p>
          <h1 className="mt-3 text-2xl font-semibold">Discover quality products faster</h1>
          <p className="mt-1 text-sm text-blue-100">
            Curated inventory with instant chat and quick checkout.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-right">
          <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
            <p className="text-xs text-blue-100">Products</p>
            <p className="text-xl font-semibold">{productCount}</p>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
            <p className="text-xs text-blue-100">Categories</p>
            <p className="text-xl font-semibold">{categoryCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
          <Store size={12} />
          Trusted Vendors
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
          <Layers size={12} />
          Rich Variant Selection
        </span>
      </div>
    </div>
  );
};

export default BuyerHeroBoard;
