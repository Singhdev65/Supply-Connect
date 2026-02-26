import { Outlet } from "react-router-dom";
import Header from "@/shared/ui/Header";
import Loader from "@/shared/ui/Loader";
import { APP_TITLES } from "@/utils/constants";
import { useAuth } from "@/shared/hooks";

export default function ChatLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Loader />
      {user && (
        <Header title={APP_TITLES.CHAT_LAYOUT} logout={logout} role={user.role} />
      )}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
