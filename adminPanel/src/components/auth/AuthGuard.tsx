import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "@/services/authSlice";
import { setUser, clearUser } from "@/features/authSlice";
import type { RootState, AppDispatch } from "@/app/store";

/**
 * AuthGuard — protects all admin routes.
 * If no token exists → redirect to /login.
 * If token exists → call /auth/me to restore user, then render children.
 */
const AuthGuard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthenticated } = useSelector((s: RootState) => s.auth);
  const hasToken = Boolean(token);

  const { data, isSuccess, isError, isLoading } = useGetMeQuery(undefined, {
    skip: !hasToken || isAuthenticated,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data.user));
    }
    if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch]);

  if (!hasToken) return <Navigate to="/login" replace />;
  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );

  return <Outlet />;
};

export default AuthGuard;
