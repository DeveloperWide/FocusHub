import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMe } from "../features/auth/authThunk";
import {
  selectAuthInitialized,
  selectUser,
} from "../features/auth/authSelector";

const ProtectedRoute = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const initialized = useAppSelector(selectAuthInitialized);

  if (!initialized) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
