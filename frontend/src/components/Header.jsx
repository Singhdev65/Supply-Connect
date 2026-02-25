import { NavLink } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Header = ({ title, logout, role }) => {
  const { unreadCount } = useContext(ChatContext);

  const navStyle = (isActive) =>
    `relative px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2
     ${
       isActive
         ? "bg-blue-600 text-white shadow-md"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow">
            <span className="text-white font-bold text-lg">SC</span>
          </div>

          <div>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Supply Connect Platform
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          {(role === "buyer" || role === "vendor") && (
            <nav className="flex gap-2">
              <NavLink
                to={`/${role}`}
                className={({ isActive }) => navStyle(isActive)}
              >
                Dashboard
              </NavLink>

              {role === "buyer" && (
                <NavLink
                  to="/orders"
                  className={({ isActive }) => navStyle(isActive)}
                >
                  Orders
                </NavLink>
              )}

              {/* ⭐ CHAT WITH BADGE */}
              <NavLink
                to="/chat"
                className={({ isActive }) => navStyle(isActive)}
              >
                <MessageCircle size={18} />
                Chat
                {unreadCount > 0 && (
                  <span
                    className="
                    absolute -top-1 -right-2
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
            </nav>
          )}

          {/* Logout */}
          {logout && (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full text-sm font-medium 
              border border-red-200 bg-red-50 text-red-600
              hover:bg-red-100 transition"
            >
              Logout →
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
