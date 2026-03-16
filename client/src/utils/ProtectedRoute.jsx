import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "../features/auth/authThunk";
import {
  selectAuthInitialized,
  selectUser,
} from "../features/auth/authSelector";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const initialized = useSelector(selectAuthInitialized);

  useEffect(() => {
    if (!initialized) {
      dispatch(fetchMe());
    }
  }, [dispatch, initialized]);

  if (!initialized) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
