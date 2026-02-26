import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircle2, List, ShoppingBag, Receipt } from "lucide-react";
import { useOrders } from "@/features/orders";
import { OrderLoadingCard } from "@/features/orders/components";
import { formatCurrency, formatDateTime } from "@/features/orders/utils/formatters";
import {
  PATHS,
  buildBuyerOrderDetailsPath,
  buildBuyerProductDetailsPath,
} from "@/utils/constants";
import {
  AppButton,
  AppCard,
  Breadcrumbs,
  EmptyState,
  OrderItemRow,
  OrderStatusBadge,
  OrderSummaryStat,
} from "@/shared/ui";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchOrders, loading } = useOrders();

  const currentOrder = useSelector((state) => state.order.currentOrder?.data);
  const orders = useSelector((state) => state.order?.orders?.data || []);
  const orderIdFromNav = location.state?.orderId;

  useEffect(() => {
    if (!currentOrder || (orderIdFromNav && currentOrder?._id !== orderIdFromNav)) {
      fetchOrders();
    }
  }, [currentOrder, orderIdFromNav, fetchOrders]);

  const order = useMemo(() => {
    if (orderIdFromNav) {
      if (currentOrder?._id === orderIdFromNav) return currentOrder;
      return orders.find((candidate) => candidate._id === orderIdFromNav) || null;
    }
    return currentOrder || orders[0] || null;
  }, [currentOrder, orders, orderIdFromNav]);

  if (!order && loading) return <OrderLoadingCard text="Loading your order..." />;

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-4">
        <AppCard className="w-full max-w-md p-6 text-center">
          <EmptyState
            title="Order details not found"
            description="Your payment may be successful. Check your order history."
          />
          <AppButton
            onClick={() => navigate(PATHS.BUYER_ORDERS)}
            fullWidth
            className="mt-4"
          >
            Go to Order History
          </AppButton>
        </AppCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7ed] via-[#fff] to-[#f8fafc] p-4 md:p-6">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Breadcrumbs
          showBack
          items={[
            { label: "Home", to: PATHS.BUYER_HOME },
            { label: "Orders", to: PATHS.BUYER_ORDERS },
            { label: "Success" },
          ]}
        />
        <AppCard className="overflow-hidden border-orange-100 shadow-xl">
          <div className="border-b bg-gradient-to-r from-emerald-50 to-green-50 p-6 text-center md:p-8">
            <CheckCircle2 size={58} className="mx-auto mb-3 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Order Confirmed</h1>
            <p className="mt-1 text-sm text-gray-600">
              Thank you for shopping. Your order is being processed.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <OrderStatusBadge status={order.status} />
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                ID: {order._id}
              </span>
            </div>
          </div>

          <div className="grid gap-3 border-b bg-white p-4 md:grid-cols-3 md:p-5">
            <OrderSummaryStat
              className="rounded-xl"
              label="Order Value"
              value={formatCurrency(order.totalAmount)}
            />
            <OrderSummaryStat
              className="rounded-xl"
              label="Total Items"
              value={order.items?.reduce((sum, item) => sum + Number(item.qty || 0), 0)}
            />
            <OrderSummaryStat
              className="rounded-xl"
              label="Placed On"
              value={formatDateTime(order.createdAt)}
            />
          </div>

          <div className="max-h-[420px] overflow-y-auto p-2 sm:p-4">
            {order.items?.map((item, index) => {
              const productId = item.product?._id || item.product;
              const isReviewEligible =
                ["Delivered", "Completed"].includes(order.status) &&
                !item.hasReviewed &&
                productId;

              return (
                <OrderItemRow
                  key={`${order._id}-${index}`}
                  item={item}
                  compact
                  showReviewAction={isReviewEligible}
                  onReviewAction={() =>
                    navigate(`${buildBuyerProductDetailsPath(productId)}?review=1`)
                  }
                />
              );
            })}
          </div>

          <div className="border-t bg-white p-4">
            <p className="text-sm font-semibold text-gray-900">Delivery Address</p>
            {order.shippingAddress ? (
              <div className="mt-1 text-sm text-gray-700">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.recipientName} ({order.shippingAddress.phone})
                </p>
                <p>
                  {order.shippingAddress.line1}
                  {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
              </div>
            ) : (
              <p className="mt-1 text-sm text-gray-500">No delivery address available.</p>
            )}
          </div>

          <div className="space-y-3 p-5">
            <AppButton onClick={() => navigate(PATHS.BUYER_HOME)} fullWidth>
              <ShoppingBag size={18} />
              Continue Shopping
            </AppButton>

            <AppButton
              onClick={() => navigate(buildBuyerOrderDetailsPath(order._id))}
              fullWidth
              variant="secondary"
            >
              <Receipt size={18} />
              View Order Details
            </AppButton>

            <AppButton
              onClick={() => navigate(PATHS.BUYER_ORDERS)}
              fullWidth
              variant="ghost"
            >
              <List size={18} />
              Order History
            </AppButton>
          </div>
        </AppCard>
      </div>
    </div>
  );
};

export default OrderSuccess;
