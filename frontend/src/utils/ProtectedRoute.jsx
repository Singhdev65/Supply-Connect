import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks";
import { PATHS, buildRoleHomePath } from "@/utils/constants";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={buildRoleHomePath(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
