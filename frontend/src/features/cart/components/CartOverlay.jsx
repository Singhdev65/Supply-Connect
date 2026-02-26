import { X } from "lucide-react";
import { useCallback, useMemo, memo } from "react";
import { useCart } from "@/features/cart";

const CartOverlay = memo(({ onClose, onSuccess }) => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart],
  );

  const increaseQty = useCallback(
    (item) => {
      if (item.qty < item.stock) {
        addToCart({ ...item, qty: 1 });
      }
    },
    [addToCart],
  );

  const decreaseQty = useCallback(
    (item) => {
      if (item.qty > 1) {
        removeFromCart({ ...item, qty: 1 });
      } else {
        removeFromCart(item);
      }
    },
    [removeFromCart],
  );

  const handleCheckout = useCallback(() => {
    onSuccess?.();
  }, [onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="relative flex h-full w-full max-w-md flex-col bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        <h2 className="mb-4 text-lg font-semibold">
          Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
        </h2>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {cart.length === 0 && (
            <p className="text-center text-gray-400">Your cart is empty</p>
          )}

          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(item)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-lg hover:bg-gray-300"
                >
                  -
                </button>

                <span className="min-w-[24px] text-center font-semibold">
                  {item.qty}
                </span>

                <button
                  onClick={() => increaseQty(item)}
                  disabled={item.qty >= item.stock}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-lg hover:bg-gray-300 disabled:opacity-40"
                >
                  +
                </button>

                <button
                  onClick={() => removeFromCart(item)}
                  className="ml-2 text-sm font-semibold text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="mt-3 w-full rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
          >
            Clear All
          </button>
        )}

        <div className="mt-4 border-t pt-4">
          <div className="mb-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white disabled:opacity-50"
          >
            Checkout
          </button>

          <button onClick={onClose} className="mt-3 w-full font-medium text-gray-500">
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

CartOverlay.displayName = "CartOverlay";

export default CartOverlay;
