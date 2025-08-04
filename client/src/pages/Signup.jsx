import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { saveUserData } from "../utils/auth";


const Signup = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (e) => {
    setData(() => {
      return { ...data, [e.target.name]: e.target.value }
    });
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios.post("/api/auth/signup", data).then((res) => {

      const { token, user } = res.data;
      saveUserData(token, user);
      navigate("/app/dashboard")

    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <div className='flex flex-col'>
      <form onSubmit={onSubmitHandler} className="flex flex-col">
        <input type="text" name="name" id="name" autoComplete='false' value={data.name} onChange={onChangeHandler} placeholder="Your Name Here" />
        <input type="email" name="email" id="email" autoComplete='false' value={data.email} onChange={onChangeHandler} placeholder='Email Address' className='mt-3' />
        <input type="password" name="password" id="password" autoComplete='false' value={data.password} onChange={onChangeHandler} placeholder='Password' />
        <button className='w-full h-12 text-xl rounded-xl font-semibold text-white bg-gradient-to-r cursor-pointer from-blue-600 to-blue-800'>Signup</button>
      </form>
      <p className="text-center text-black mt-2">Already Have a Account ? <Link to="/login" className="text-blue-500 cursor-pointer">Login here</Link></p>
    </div>
  )
}

export default Signup