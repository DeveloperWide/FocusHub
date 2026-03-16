import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authThunk";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutUser())
      .unwrap()
      .finally(() => {
        toast.success("Logged out successfully");
        navigate("/login", { replace: true });
      });
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
