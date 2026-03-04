import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "@/services/authSlice";
import { setUser, clearUser } from "@/features/authSlice";
import type { AppDispatch } from "@/app/store";

/**
 * AuthInitializer — Runs once on app mount.
 * If a token exists in localStorage, calls GET /auth/me to restore the user
 * into Redux state. If the call fails (expired / invalid token), clears everything.
 */
const AuthInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hasToken = Boolean(localStorage.getItem("token"));

  // Only trigger the query when there is a saved token
  const { data, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: !hasToken,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const response = data as { user: Parameters<typeof setUser>[0] };
      dispatch(setUser(response.user));
    }
    if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch]);

  return null; // renders nothing
};

export default AuthInitializer;
