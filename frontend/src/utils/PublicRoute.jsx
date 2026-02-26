import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks";
import { PATHS, USER_ROLES } from "@/utils/constants";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return user.role === USER_ROLES.VENDOR ? (
      <Navigate to={PATHS.VENDOR_HOME} replace />
    ) : (
      <Navigate to={PATHS.BUYER_HOME} replace />
    );
  }

  return children;
};

export default PublicRoute;
