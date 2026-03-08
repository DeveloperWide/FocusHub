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

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

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
    <div>
      <div>
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-y-3">
          <TextField
            required
            type="email"
            name="email"
            id="email outlined-required"
            label="Email"
            value={data.email}
            onChange={onChangeHandler}
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              required
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={onChangeHandler}
              name="password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <p className="text-blue-500 capitalize ms-2 my-0.5 cursor-pointer">
            Forgot password?
          </p>
          <button
            className={`w-full my-2 px-3 py-2  bg-gradient-to-r ${loading ? "cursor-alias" : "cursor-pointer"} from-blue-600 to-blue-800 rounded-2xl font-semibold text-xl text-white`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-black mt-2">
          Not a member?{" "}
          <Link to={"/signup"} className="text-blue-500 cursor-pointer">
            Signup now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
