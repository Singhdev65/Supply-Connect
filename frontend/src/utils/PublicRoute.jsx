import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    return user.role === "vendor" ? (
      <Navigate to="/vendor" replace />
    ) : (
      <Navigate to="/buyer" replace />
    );
  }

  return children;
};

export default PublicRoute;
