import { Outlet } from "react-router-dom";
import Header from "@/shared/ui/Header";
import Loader from "@/shared/ui/Loader";
import { APP_TITLES } from "@/utils/constants";
import { useAuth } from "@/shared/hooks";

export default function VendorLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Loader />
      {user && (
        <Header title={APP_TITLES.VENDOR_LAYOUT} logout={logout} role={user.role} />
      )}
      <Outlet />
    </div>
  );
}
