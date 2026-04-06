import { lazy } from "react";
import { featureFlags } from "@/app/config/featureFlags";
import { PATHS, PATH_SEGMENTS, USER_ROLES } from "@/utils/constants";

const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const BuyerLayout = lazy(() => import("@/layouts/BuyerLayout"));
const VendorLayout = lazy(() => import("@/layouts/VendorLayout"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
const ChatLayout = lazy(() => import("@/layouts/ChatLayout"));

const Login = lazy(() => import("@/features/auth/pages/Login"));
const Signup = lazy(() => import("@/features/auth/pages/Signup"));
const ForgotPassword = lazy(() => import("@/features/auth/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/features/auth/pages/ResetPassword"));
const BuyerDashboard = lazy(() => import("@/features/buyer/pages/BuyerDashboard"));
const ProductDetails = lazy(() => import("@/features/products/pages/ProductDetails"));
const WishlistPage = lazy(() => import("@/features/buyer/pages/WishlistPage"));
const RecentlyViewedPage = lazy(() => import("@/features/buyer/pages/RecentlyViewedPage"));
const VendorDashboard = lazy(() => import("@/features/vendor/pages/VendorDashboard"));
const AdminDashboard = lazy(() => import("@/features/admin/pages/AdminDashboard"));
const Chat = lazy(() => import("@/features/chat/pages/Chat"));
const CheckoutPage = lazy(() => import("@/features/checkout/pages/index"));
const PaymentPage = lazy(() => import("@/features/payment/pages/index"));
const OrderSuccess = lazy(() => import("@/features/orders/pages/OrderSuccess"));
const OrderHistory = lazy(() => import("@/features/orders/pages/OrderHistory"));
const OrderDetails = lazy(() => import("@/features/orders/pages/OrderDetails"));
const ProfilePage = lazy(() => import("@/features/profile/pages/Profile"));
const NotFound = lazy(() => import("@/shared/pages/NotFound"));

const vendorChildren = [
  {
    index: true,
    element: VendorDashboard,
  },
  {
    path: PATH_SEGMENTS.PRODUCT_DETAILS,
    element: ProductDetails,
  },
  {
    path: PATH_SEGMENTS.PROFILE,
    element: ProfilePage,
  },
  {
    path: PATH_SEGMENTS.WISHLIST,
    element: WishlistPage,
  },
  {
    path: PATH_SEGMENTS.RECENTLY_VIEWED,
    element: RecentlyViewedPage,
  },
  ...(featureFlags.chat
    ? [
            {
              path: PATH_SEGMENTS.CHAT,
              element: Chat,
            },
      ]
    : []),
];

const buyerChildren = [
  {
    index: true,
    element: BuyerDashboard,
  },
  {
    path: PATH_SEGMENTS.PRODUCT_DETAILS,
    element: ProductDetails,
  },
  {
    path: PATH_SEGMENTS.PROFILE,
    element: ProfilePage,
  },
  ...(featureFlags.checkout
    ? [
            {
              path: PATH_SEGMENTS.CHECKOUT,
              element: CheckoutPage,
            },
      ]
    : []),
  ...(featureFlags.payment
    ? [
            {
              path: PATH_SEGMENTS.PAYMENT_WITH_ORDER_ID,
              element: PaymentPage,
            },
      ]
    : []),
  ...(featureFlags.orders
    ? [
            {
              path: PATH_SEGMENTS.ORDER_SUCCESS,
              element: OrderSuccess,
            },
            {
              path: PATH_SEGMENTS.ORDERS,
              element: OrderHistory,
            },
            {
              path: PATH_SEGMENTS.ORDER_DETAILS,
              element: OrderDetails,
            },
      ]
    : []),
  ...(featureFlags.chat
    ? [
            {
              path: PATH_SEGMENTS.CHAT,
              element: Chat,
            },
      ]
    : []),
];

export const routeConfig = [
  {
    path: PATHS.ROOT,
    element: AuthLayout,
    isLayout: true,
    children: [
      {
        index: true,
        redirect: PATHS.LOGIN,
      },
      {
        path: PATH_SEGMENTS.LOGIN,
        element: Login,
        isPublic: true,
      },
      {
        path: PATH_SEGMENTS.SIGNUP,
        element: Signup,
        isPublic: true,
      },
      {
        path: PATH_SEGMENTS.FORGOT_PASSWORD,
        element: ForgotPassword,
        isPublic: true,
      },
      {
        path: PATH_SEGMENTS.RESET_PASSWORD,
        element: ResetPassword,
        isPublic: true,
      },
    ],
  },
  {
    path: PATHS.VENDOR_HOME,
    element: VendorLayout,
    isLayout: true,
    roles: [USER_ROLES.VENDOR],
    children: vendorChildren,
  },
  {
    path: PATHS.BUYER_HOME,
    element: BuyerLayout,
    isLayout: true,
    roles: [USER_ROLES.BUYER],
    children: buyerChildren,
  },
  {
    path: PATHS.ADMIN_HOME,
    element: AdminLayout,
    isLayout: true,
    roles: [USER_ROLES.ADMIN, USER_ROLES.OPS_MANAGER, USER_ROLES.SUPPORT, USER_ROLES.FINANCE],
    children: [
      {
        index: true,
        element: AdminDashboard,
      },
    ],
  },
  ...(featureFlags.chat
    ? [
        {
          path: PATHS.CHAT,
          element: ChatLayout,
          isLayout: true,
          roles: [USER_ROLES.BUYER, USER_ROLES.VENDOR],
          children: [
            {
              index: true,
              element: Chat,
            },
          ],
        },
      ]
    : []),
  {
    path: PATHS.NOT_FOUND,
    element: NotFound,
  },
];
