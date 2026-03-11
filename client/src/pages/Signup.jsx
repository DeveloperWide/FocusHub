import { useEffect, useState } from "react";
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
import { signupUser } from "../features/auth/authThunk";
import { selectAuthLoading } from "../features/auth/authSelector";
import { axiosInstance } from "../utils/axiosInstance";

const Signup = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [available, setAvailable] = useState(null);
  const [usernameLoading, setUsernameLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);

  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const onChangeHandler = (e) => {
    setData(() => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  useEffect(() => {
    if (!data.username || data.username.length < 5) {
      setAvailable(null);
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setUsernameLoading(true);
        const res = await axiosInstance.get(
          `/auth/u/check-username/${data.username}`,
        );
        console.log(res);

        setAvailable(res.data.available);

        if (!res.data.available) {
          const suggestionRes = await axiosInstance.get(
            `/auth/u/suggest/${data.username}`,
          );

          setSuggestions(suggestionRes.data.suggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUsernameLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [data.username]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    dispatch(signupUser(data))
      .unwrap()
      .then(() => {
        toast.success("Successfully Sign in");
        navigate("/app/dashboard");
      })
      .catch((err) => {
        toast.error(err || "Signup Failed");
      });
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
        <TextField
          required
          type="text"
          name="name"
          label="Full Name"
          value={data.name}
          onChange={onChangeHandler}
          fullWidth
        />

        <div>
          <TextField
            required
            type="text"
            name="username"
            label="Username"
            value={data.username}
            onChange={onChangeHandler}
            fullWidth
          />

          <p className="text-xs text-gray-400 mt-1">
            focushub.co.in/u/{data.username || "username"}
          </p>

          {usernameLoading && (
            <p className="text-sm text-gray-500">Checking username...</p>
          )}

          {available === true && (
            <p className="text-sm text-green-600">✓ Username available</p>
          )}

          {available === false && (
            <p className="text-sm text-red-500">Username already taken</p>
          )}

          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestions.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      username: name,
                    }))
                  }
                  className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

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

        <button
          disabled={loading || available === false}
          className="h-11 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90 transition"
        >
          {loading ? "Signing up..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
