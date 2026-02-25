import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderDetails = () => {
  const { id } = useParams();
  const order = useSelector((state) => state?.order?.currentOrder?.data);

  if (!order || order._id !== id) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Order Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          We couldn't find an order with ID{" "}
          <span className="font-mono">{id}</span>.
        </p>
        <Link
          to="/orders"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Details</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
        {order.items.map((item, index) => (
          <div
            key={item._id || index}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b pb-4 last:border-b-0"
          >
            <img
              src={item.product?.images?.[0] || "/api/placeholder/80/80"}
              alt={item.product?.name || "Product image"}
              className="w-24 h-24 object-cover rounded-lg shadow"
            />
            <div className="flex-1 space-y-1">
              <h2 className="font-semibold text-lg text-gray-800">
                {item.product?.name || "Product Name"}
              </h2>
              <p className="text-gray-500 text-sm">
                Qty: {item.qty} | Size:{" "}
                {item.product?.variants?.[0]?.size || "N/A"} | Color:{" "}
                {item.product?.variants?.[0]?.color || "Standard"}
              </p>
              <div className="flex justify-between mt-2 text-gray-700">
                <span>
                  {item.qty} × ${item.price?.toFixed(2)}
                </span>
                <span>${(item.qty * item.price)?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="border-t pt-4 flex justify-between font-bold text-xl text-gray-900">
          <span>Total</span>
          <span>${order.totalAmount?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
