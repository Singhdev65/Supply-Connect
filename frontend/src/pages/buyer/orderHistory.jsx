import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Package, Calendar, ShoppingBag } from "lucide-react";
import useOrders from "../../hooks/useOrders";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(date || Date.now()),
  );

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    default: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
        styles[status] || styles.default
      }`}
    >
      {status}
    </span>
  );
};

const OrderItemSkeleton = () => (
  <div className="h-20 w-full bg-gray-100 rounded-xl animate-pulse mb-4" />
);

const OrderCard = React.memo(({ order, isExpanded, onToggle }) => {
  const formattedDate = useMemo(
    () => formatDate(order.createdAt),
    [order.createdAt],
  );
  const formattedPrice = useMemo(
    () => formatPrice(order.totalAmount),
    [order.totalAmount],
  );

  return (
    <div className="group border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-blue-300 transition-colors shadow-sm">
      <button
        onClick={() => onToggle(order._id)}
        className="w-full px-5 py-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4 text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Package size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">
              Order #{order._id.toUpperCase()}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {formattedDate}
              </span>
              <span className="hidden md:inline">•</span>
              <span className="font-semibold text-gray-700">
                {formattedPrice}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <StatusBadge status={order.status} />
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-gray-400"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gray-100 bg-gray-50/30"
          >
            <div className="p-5 space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start group/item">
                  <div className="relative h-20 w-20 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={item.product.images?.[0] || "/api/placeholder/80/80"}
                      alt={item.product.name || "Product image"}
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="font-semibold text-gray-900">
                        ${item.price}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Qty: {item.qty} | Size:{" "}
                      {item.product.variants?.[0]?.size || "N/A"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full border border-gray-200"
                        style={{
                          backgroundColor:
                            item.product.variants?.[0]?.color?.toLowerCase(),
                        }}
                      />
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                        {item.product.variants?.[0]?.color || "Standard"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 mt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-500 italic">
                  Tracking available in 24-48 hours
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const OrderHistory = () => {
  const { orders, fetchOrders, loading } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleExpand = useCallback(
    (orderId) =>
      setExpandedOrder((prev) => (prev === orderId ? null : orderId)),
    [],
  );

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        {[...Array(4)].map((_, i) => (
          <OrderItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
        <p className="text-gray-500 mt-2 max-w-xs">
          Once you start shopping, your order history will appear here.
        </p>
        <button className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-shadow shadow-md">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto pb-20">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Purchase History
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track your recent orders
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
            Total Orders
          </p>
          <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
        </div>
      </header>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            isExpanded={expandedOrder === order._id}
            onToggle={toggleExpand}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
