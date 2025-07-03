import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  loginUser,
  registerUser,
  logoutUser,
  clearError,
  initializeAuth,
} from "../store/authSlice";
import type { LoginRequest, RegisterRequest } from "../types";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = useCallback(
    (credentials: LoginRequest) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const register = useCallback(
    (userData: RegisterRequest) => {
      return dispatch(registerUser(userData));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const initialize = useCallback(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return {
    ...auth,
    login,
    register,
    logout,
    clearError: clearAuthError,
    initialize,
  };
};
