import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks";
import { buildRoleHomePath } from "@/utils/constants";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={buildRoleHomePath(user.role)} replace />;
  }

  return children;
};

export default PublicRoute;
