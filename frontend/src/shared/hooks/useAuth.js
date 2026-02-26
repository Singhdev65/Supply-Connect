import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "@/features/auth/store/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    logout: () => dispatch(logoutAction()),
  };
};

export default useAuth;

