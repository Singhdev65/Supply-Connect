import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import OrderSuccess from "./pages/buyer/OrderSuccess";
import OrderHistory from "./pages/buyer/orderHistory";
import OrderDetails from "./pages/buyer/Orders";
import NotFound from "./pages/NotFound";

import { Chat } from "./components/chat";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRoute from "./utils/PublicRoute";
import Loader from "./components/Loader";
import Header from "./components/Header";

import { useContext } from "react";

/* =========================
   APP SHELL (USES AUTH)
========================= */
const AppShell = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <ChatProvider user={user}>
      <Loader />

      <Router>
        {user && (
          <Header title="Supply Connect" logout={logout} role={user.role} />
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Vendor */}
          <Route
            path="/vendor"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Buyer */}
          <Route
            path="/buyer"
            element={
              <ProtectedRoute roles={["buyer"]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-success"
            element={
              <ProtectedRoute roles={["buyer"]}>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["buyer"]}>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute roles={["buyer"]}>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          {/* Chat */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute roles={["buyer", "vendor"]}>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
};

/* =========================
   ROOT APP
========================= */
const App = () => {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
};

export default App;
