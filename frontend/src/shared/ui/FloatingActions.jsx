import { ShoppingCart } from "lucide-react";

const FloatingActions = ({ cartCount, onCartOpen }) => {
  return (
    <button
      onClick={onCartOpen}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-xl"
    >
      <ShoppingCart size={20} />
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-2 text-xs text-white">
          {cartCount}
        </span>
      )}
    </button>
  );
};

export default FloatingActions;

