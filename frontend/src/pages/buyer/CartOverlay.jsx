import useCart from "../../hooks/useCart";
import useOrders from "../../hooks/useOrders";
import { X } from "lucide-react";

const CartOverlay = ({ onClose, onSuccess }) => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { checkout, loading, error } = useOrders();

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const increaseQty = (item) => {
    if (item.qty < item.stock) {
      addToCart({ ...item, qty: 1 });
    }
  };

  const decreaseQty = (item) => {
    if (item.qty > 1) {
      removeFromCart({ ...item, qty: 1 });
    } else {
      removeFromCart(item);
    }
  };

  const removeItem = (item) => {
    removeFromCart(item);
  };

  const handleCheckout = async () => {
    const res = await checkout(cart);
    if (res.meta.requestStatus === "fulfilled") {
      onSuccess();
      clearCart();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full p-6 flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 && (
            <p className="text-center text-gray-400">Your cart is empty</p>
          )}

          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(item)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center text-lg"
                >
                  −
                </button>

                <span className="min-w-[24px] text-center font-semibold">
                  {item.qty}
                </span>

                <button
                  onClick={() => increaseQty(item)}
                  disabled={item.qty >= item.stock}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center text-lg disabled:opacity-40"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item)}
                  className="ml-2 text-red-600 hover:text-red-800 font-semibold text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="w-full mt-3 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
          >
            Clear All
          </button>
        )}

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-semibold mb-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Checkout"}
          </button>

          <button
            onClick={onClose}
            className="w-full mt-3 text-gray-500 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartOverlay;
