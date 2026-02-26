import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks";
import { PATHS, USER_ROLES } from "@/utils/constants";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return user.role === USER_ROLES.VENDOR ? (
      <Navigate to={PATHS.VENDOR_HOME} replace />
    ) : (
      <Navigate to={PATHS.BUYER_HOME} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
