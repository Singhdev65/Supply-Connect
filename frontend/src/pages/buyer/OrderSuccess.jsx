import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const order = useSelector((state) => state.order.currentOrder?.data);

  console.log(order, "order");

  if (!order) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Order Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Order ID: <span className="font-medium">{order._id}</span>
        </p>

        <div className="space-y-4">
          {order?.items.map((item) => (
            <div
              key={item.product?._id || item.product}
              className="flex items-center justify-between rounded-xl p-3"
            >
              {/* Product Image */}
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />

                {/* Product Info */}
                <div>
                  <h3 className="font-semibold">{item.product?.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  <p className="text-sm text-gray-500">Price: ${item.price}</p>
                </div>
              </div>

              {/* Subtotal */}
              <div className="font-semibold">
                ${(item.qty * item.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>${order.totalAmount}</span>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate("/buyer")}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold"
          >
            Back to Shop
          </button>

          <button
            onClick={() => navigate(`/orders/${order._id}`)}
            className="w-full py-3 rounded-xl border border-gray-300 font-semibold"
          >
            View Order Details
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="w-full py-3 rounded-xl text-gray-600"
          >
            View Order History
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
