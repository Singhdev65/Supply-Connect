import React from "react";
import useCart from "../hooks/useCart";

const Cart = ({ onClose }) => {
  const { cart, cartCount, addToCart, removeFromCart, clearCart } = useCart();

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

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="h-full flex flex-col bg-white shadow-lg w-full md:w-96">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">
          Your Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 && (
          <p className="text-center text-gray-400">Your cart is empty</p>
        )}

        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border-b pb-3"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
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

      <div className="p-4 border-t">
        <div className="flex justify-between font-semibold mb-3">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          disabled={cart.length === 0}
          onClick={() => alert("Checkout functionality goes here")}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg py-2 font-medium"
        >
          Checkout
        </button>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 font-medium"
          >
            Clear Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;
