import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { saveUserData } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const onChangeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios.post("/api/auth/login", data).then((res) => {
      const {token , user} = res.data;
      saveUserData(token, user);
      navigate("/app/dashboard")
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <div>
      <div>
        <form onSubmit={onSubmitHandler}>
          <input type="email" name="email" id="email" autoComplete='off' value={data.email} onChange={onChangeHandler} className='border mt-4 w-full px-3 py-2 outline-none rounded-2xl border-gray-400' placeholder='Email Address' />
          <input type="password" name="password" id="password" autoComplete='off' value={data.password} onChange={onChangeHandler} className='border my-1 mb-0 w-full px-3 py-2 outline-none rounded-2xl border-gray-400' placeholder='Password' />
          <p className='text-blue-500 capitalize ms-2 my-0.5 cursor-pointer'>Forgot password?</p>
          <button className='w-full my-2 px-3 py-2 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl font-semibold text-xl text-white'>Login</button>
        </form>
        <p className='text-center text-black mt-2'>Not a member? <Link to={"/signup"} className='text-blue-500 cursor-pointer'>Signup now</Link></p>
      </div>
    </div>
  )
}

export default Login