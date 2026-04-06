import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { placeOrder } from "../api";
import { useCart } from "@/features/cart";
import { fetchActiveDealsApi, validateCouponApi } from "@/features/buyer/api";
import { fetchMyProfileApi } from "@/features/profile/api";
import { setCurrentOrder } from "@/features/orders";
import { buildBuyerPaymentPath, buildBuyerProfilePath, PATHS } from "@/utils/constants";
import { AppButton, AppCard, Breadcrumbs, EmptyState, PageContainer } from "@/shared/ui";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [activeDeals, setActiveDeals] = useState([]);

  useEffect(() => {
    const run = async () => {
      const data = await fetchMyProfileApi();
      setProfile(data);
      const defaultAddress = data?.addresses?.find((address) => address.isDefault);
      setSelectedAddressId(defaultAddress?.id || data?.addresses?.[0]?.id || "");
    };

    run();
  }, []);

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const deals = await fetchActiveDealsApi();
        setActiveDeals(deals || []);
      } catch (error) {
        console.error("Failed to fetch deals", error);
      }
    };

    loadDeals();
  }, []);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart],
  );
  const finalTotal = Math.max(total - Number(couponResult?.discountAmount || 0), 0);

  const handleApplyCoupon = async () => {
    const code = String(couponCode || "").trim().toUpperCase();
    if (!code || !cart?.length) return;

    setCouponError("");
    setValidatingCoupon(true);
    try {
      const result = await validateCouponApi({
        code,
        items: cart.map((item) => ({ product: item._id, qty: item.qty })),
      });
      setCouponResult(result);
    } catch (error) {
      setCouponResult(null);
      setCouponError(error?.response?.data?.message || "Invalid coupon code");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (!cart?.length || !selectedAddressId) return;
    setPlacingOrder(true);
    try {
      const order = await placeOrder({
        items: cart,
        addressId: selectedAddressId,
        deliveryNotes,
        couponCode: couponResult?.code || "",
      });
      dispatch(setCurrentOrder(order));
      clearCart();
      navigate(buildBuyerPaymentPath(order._id));
    } catch (err) {
      console.error(err);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!cart?.length) {
    return (
      <PageContainer className="max-w-4xl text-center">
        <Breadcrumbs showBack items={[{ label: "Home", to: PATHS.BUYER_HOME }, { label: "Checkout" }]} />
        <h1 className="mb-4 text-2xl font-semibold">Checkout</h1>
        <EmptyState title="Your cart is empty" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-4xl space-y-6">
      <Breadcrumbs showBack items={[{ label: "Home", to: PATHS.BUYER_HOME }, { label: "Checkout" }]} />
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <AppCard className="rounded-lg p-4">
        <div className="mb-4 rounded-lg border border-dashed border-indigo-200 bg-indigo-50 p-3">
          <p className="text-sm font-semibold text-indigo-900">Apply Coupon</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setCouponError("");
              }}
              placeholder="Enter coupon code"
              className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm"
            />
            <AppButton onClick={handleApplyCoupon} disabled={validatingCoupon}>
              {validatingCoupon ? "Validating..." : "Apply"}
            </AppButton>
          </div>
          {couponResult ? (
            <p className="mt-2 text-sm text-emerald-700">
              Applied <span className="font-semibold">{couponResult.code}</span>: saved Rs{" "}
              {Number(couponResult.discountAmount || 0).toFixed(2)}
            </p>
          ) : null}
          {couponError ? <p className="mt-2 text-sm text-red-600">{couponError}</p> : null}
          {activeDeals.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {activeDeals.slice(0, 4).map((deal) => (
                <button
                  key={deal.code}
                  onClick={() => setCouponCode(deal.code)}
                  className="rounded-full border border-indigo-300 bg-white px-3 py-1 text-xs font-semibold text-indigo-700"
                >
                  {deal.code}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mb-4 rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-900">Delivery Address</p>
            <button
              onClick={() => navigate(buildBuyerProfilePath())}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Manage addresses
            </button>
          </div>

          {!profile?.addresses?.length ? (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              No saved address found. Please add at least one delivery address.
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {profile.addresses.map((address) => (
                <label
                  key={address.id}
                  className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2 ${
                    selectedAddressId === address.id
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">
                      {address.recipientName} ({address.phone})
                    </span>
                    <br />
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state}{" "}
                    {address.postalCode}
                  </span>
                </label>
              ))}
            </div>
          )}

          <textarea
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            rows={2}
            placeholder="Delivery notes (optional)"
            className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {cart.map((item) => (
          <div key={item._id} className="flex justify-between border-b py-3 last:border-b-0">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.qty}</p>
            </div>
            <p className="font-semibold">Rs {(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}

        <div className="mt-4 space-y-1 border-t-2 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">Rs {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount:</span>
            <span className="font-medium text-emerald-600">
              - Rs {Number(couponResult?.discountAmount || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>Rs {finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </AppCard>

      <AppButton
        onClick={handleCheckout}
        fullWidth
        disabled={!profile?.addresses?.length || !selectedAddressId || placingOrder}
      >
        {placingOrder ? "Placing order..." : "Proceed to Payment"}
      </AppButton>
    </PageContainer>
  );
};

export default CheckoutPage;
