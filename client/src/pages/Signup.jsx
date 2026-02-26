import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { saveUserData } from "../utils/auth";
import { toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextField from "@mui/material/TextField";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const onChangeHandler = (e) => {
    setData(() => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/api/auth/signup`, data)
      .then((res) => {
        const { token, user } = res.data;
        saveUserData(token, user);
        toast.success(res.data.message);
        navigate("/app/dashboard");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message || "Something Went Wrong");
      });
  };

  return (
    <div className="flex flex-col">
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
                    showPassword ? "hide the password" : "display the password"
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
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Repeat Password
          </InputLabel>
          <OutlinedInput
            required
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={data.repeatPassword}
            onChange={onChangeHandler}
            name="repeatPassword"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
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
            label="Repeat Password"
          />
        </FormControl>
        <button className="w-full h-12 text-xl rounded-xl font-semibold text-white bg-gradient-to-r cursor-pointer from-blue-600 to-blue-800">
          Signup
        </button>
      </form>
      <p className="text-center text-black mt-2">
        Already Have a Account ?{" "}
        <Link to="/login" className="text-blue-500 cursor-pointer">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Signup;
