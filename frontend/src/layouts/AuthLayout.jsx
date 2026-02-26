import { Outlet } from "react-router-dom";
import Loader from "@/shared/ui/Loader";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Loader />
      <Outlet />
    </div>
  );
}
