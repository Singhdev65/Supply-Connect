import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, Package, ShoppingBag, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../store/orderSlice";
import { OrderLoadingCard, OrdersHeroCard } from "@/features/orders/components";
import { formatCurrency, formatDateTime } from "@/features/orders/utils/formatters";
import {
  buildBuyerOrderDetailsPath,
  buildBuyerProductDetailsPath,
  PATHS,
} from "@/utils/constants";
import {
  AppButton,
  AppCard,
  Breadcrumbs,
  EmptyState,
  OrderItemRow,
  OrderStatusBadge,
  OrderSummaryStat,
  PageContainer,
} from "@/shared/ui";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.order?.orders?.data || []);
  const loading = useSelector((state) => state.order?.loading || false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const toggleExpand = (id) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  if (loading && !orders.length) {
    return <OrderLoadingCard text="Loading your orders..." />;
  }

  if (!orders.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No Orders Yet"
        description="Start shopping to see your orders here."
        className="h-[70vh]"
      />
    );
  }

  return (
    <PageContainer className="max-w-6xl pb-24">
      <Breadcrumbs showBack items={[{ label: "Home", to: PATHS.BUYER_HOME }, { label: "Orders" }]} />
      <OrdersHeroCard
        title="Your Orders"
        subtitle="Track order status and view item-level details."
      />

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order._id;
          const totalItems = order.items?.reduce((sum, item) => sum + Number(item.qty || 0), 0);

          return (
            <AppCard
              key={order._id}
              className="overflow-hidden border-gray-200 bg-white transition hover:shadow-md"
            >
              <div
                onClick={() => toggleExpand(order._id)}
                className="cursor-pointer border-b bg-white p-4 md:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                      <Package className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <ChevronDown
                      className={`text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <OrderSummaryStat
                    className="px-3 py-2"
                    label="Order Value"
                    value={formatCurrency(order.totalAmount)}
                  />
                  <OrderSummaryStat className="px-3 py-2" label="Total Quantity" value={totalItems} />
                  <OrderSummaryStat
                    className="px-3 py-2"
                    label="Unique Items"
                    value={order.items?.length || 0}
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="bg-[#fcfcfd]">
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

                  <div className="flex flex-wrap items-center justify-end gap-2 border-t p-4">
                    {order.shippingAddress ? (
                      <p className="mr-auto text-xs text-gray-500">
                        Delivering to {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                    ) : null}
                    <AppButton
                      variant="secondary"
                      onClick={() => navigate(buildBuyerOrderDetailsPath(order._id))}
                    >
                      <Info size={16} />
                      View Details
                    </AppButton>
                  </div>
                </div>
              )}
            </AppCard>
          );
        })}
      </div>
    </PageContainer>
  );
};

export default OrderHistory;
