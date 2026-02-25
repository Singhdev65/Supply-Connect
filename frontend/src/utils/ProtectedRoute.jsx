import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return user.role === "vendor" ? (
      <Navigate to="/vendor" replace />
    ) : (
      <Navigate to="/buyer" replace />
    );
  }

  return children;
};

export default ProtectedRoute;
