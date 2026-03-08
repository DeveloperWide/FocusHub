import { useDispatch } from "react-redux";
import { logoutLocal } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const Logout = () => {
  const dispatch = useDispatch();

  dispatch(logoutLocal())
    .unwrap()
    .then(() => {
      toast.success("Loggout Out Successfully");
    });
};

export default Logout;
