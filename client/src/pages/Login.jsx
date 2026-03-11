import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authThunk";
import { selectAuthLoading } from "../features/auth/authSelector";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onChangeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser(data))
      .unwrap()
      .then(() => {
        toast.success("Successfully logged In");
        navigate("/app/dashboard");
      })
      .catch((err) => {
        toast.error(err || "Failed to Signup");
      });
  };

  return (
    <>
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
        <TextField
          required
          type="email"
          name="email"
          label="Email"
          value={data.email}
          onChange={onChangeHandler}
          fullWidth
        />

        <FormControl variant="outlined" fullWidth>
          <InputLabel>Password</InputLabel>

          <OutlinedInput
            type={showPassword ? "text" : "password"}
            value={data.password}
            name="password"
            onChange={onChangeHandler}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <p className="text-sm text-blue-500 cursor-pointer">Forgot password?</p>

        <button
          disabled={loading}
          className="h-11 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Not a member?
        <Link to="/signup" className="text-blue-600 ml-1 font-medium">
          Signup
        </Link>
      </p>
    </>
  );
};

export default Login;
