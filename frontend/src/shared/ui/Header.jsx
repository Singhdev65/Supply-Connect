import { NavLink, useNavigate } from "react-router-dom";
import { MessageCircle, LayoutDashboard, Package, LogOut, UserCircle2 } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "@/features/chat";
import {
  PATHS,
  USER_ROLES,
  buildRoleChatPath,
  buildRoleHomePath,
  buildRoleOrdersPath,
  buildRoleProfilePath,
} from "@/utils/constants";

const Header = ({ title, logout, role }) => {
  const navigate = useNavigate();
  const { unreadCount } = useContext(ChatContext);

  const handleLogout = () => {
    logout?.();
    navigate(PATHS.LOGIN, { replace: true });
  };

  /* ================= NAV STYLE ================= */
  const navStyle = ({ isActive }) =>
    `relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
     ${
       isActive
         ? "bg-blue-600 text-white shadow-md"
         : "text-gray-700 hover:bg-gray-200"
     }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 grid grid-cols-3 items-center">
        {/* ---------- LEFT : BRAND ---------- */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold">SC</span>
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-500">Supply Connect</p>
          </div>
        </div>

        {/* ---------- CENTER : NAVIGATION ---------- */}
        {(role === USER_ROLES.BUYER || role === USER_ROLES.VENDOR) && (
          <nav className="flex justify-center">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full">
              {/* DASHBOARD */}
              <NavLink to={buildRoleHomePath(role)} end className={navStyle}>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>

              {/* BUYER ORDERS */}
              {role === USER_ROLES.BUYER && (
                <NavLink to={buildRoleOrdersPath(role)} className={navStyle}>
                  <Package size={16} />
                  Orders
                </NavLink>
              )}

              {/* CHAT */}
              <NavLink to={buildRoleChatPath(role)} className={navStyle}>
                <MessageCircle size={16} />
                Chat
                {unreadCount > 0 && (
                  <span
                    className="
                      absolute -top-1 -right-1
                      bg-red-500 text-white text-[10px]
                      min-w-[18px] h-[18px]
                      flex items-center justify-center
                      rounded-full font-semibold shadow
                    "
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>

              <NavLink to={buildRoleProfilePath(role)} className={navStyle}>
                <UserCircle2 size={16} />
                Profile
              </NavLink>
            </div>
          </nav>
        )}

        {/* ---------- RIGHT : LOGOUT ---------- */}
        <div className="flex justify-end">
          {logout && (
            <button
              onClick={handleLogout}
              className="
                flex items-center gap-2
                px-4 py-2 rounded-full
                text-sm font-medium
                bg-red-50 text-red-600
                hover:bg-red-100
                transition-all
                border border-red-200
              "
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
