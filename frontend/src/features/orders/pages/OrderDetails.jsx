import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useOrders } from "@/features/orders";
import { OrderLoadingCard } from "@/features/orders/components";
import { formatCurrency, formatDate } from "@/features/orders/utils/formatters";
import { buildBuyerProductDetailsPath, PATHS } from "@/utils/constants";
import {
  AppCard,
  AppButton,
  Breadcrumbs,
  EmptyState,
  OrderItemRow,
  OrderStatusBadge,
  OrderSummaryStat,
  PageContainer,
} from "@/shared/ui";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchOrders, loading } = useOrders();
  const currentOrder = useSelector((state) => state?.order?.currentOrder?.data);
  const orders = useSelector((state) => state?.order?.orders?.data || []);

  useEffect(() => {
    if ((!currentOrder || currentOrder?._id !== id) && !orders.length) {
      fetchOrders();
    }
  }, [currentOrder, id, orders.length, fetchOrders]);

  const order = useMemo(() => {
    if (currentOrder?._id === id) return currentOrder;
    return orders.find((candidate) => candidate._id === id) || null;
  }, [currentOrder, orders, id]);

  if (!order && loading) return <OrderLoadingCard text="Loading order details..." />;

  if (!order) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center">
        <EmptyState title="Order Not Found" />
        <Link to={PATHS.BUYER_ORDERS} className="mt-4">
          <AppButton>Back to Orders</AppButton>
        </Link>
      </div>
    );
  }

  const totalItems = order.items?.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  return (
    <PageContainer className="max-w-5xl space-y-5">
      <Breadcrumbs
        showBack
        items={[
          { label: "Home", to: PATHS.BUYER_HOME },
          { label: "Orders", to: PATHS.BUYER_ORDERS },
          { label: "Order Details" },
        ]}
      />
      <AppCard className="overflow-hidden border-orange-100">
        <div className="bg-gradient-to-r from-[#fff7ed] to-[#fff] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="mt-1 text-sm text-gray-600">Order ID: {order._id}</p>
            </div>
            <OrderStatusBadge status={order.status} className="text-sm" />
          </div>
        </div>

        <div className="grid gap-3 border-t p-4 sm:grid-cols-2 lg:grid-cols-4">
          <OrderSummaryStat label="Order Value" value={formatCurrency(order.totalAmount)} />
          <OrderSummaryStat label="Total Quantity" value={totalItems} />
          <OrderSummaryStat label="Items" value={order.items?.length || 0} />
          <OrderSummaryStat
            label="Ordered On"
            value={formatDate(order.createdAt)}
          />
        </div>
      </AppCard>

      <AppCard>
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
              showReviewAction={isReviewEligible}
              onReviewAction={() =>
                navigate(`${buildBuyerProductDetailsPath(productId)}?review=1`)
              }
            />
          );
        })}
      </AppCard>

      <AppCard className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">Delivery Address</h2>
        {order.shippingAddress ? (
          <div className="text-sm text-gray-700">
            <p className="font-medium text-gray-900">
              {order.shippingAddress.recipientName} ({order.shippingAddress.phone})
            </p>
            <p>
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
            </p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.deliveryNotes ? (
              <p className="mt-1 text-xs text-gray-500">Note: {order.deliveryNotes}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No delivery address available.</p>
        )}
      </AppCard>
    </PageContainer>
  );
};

export default OrderDetails;
