import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"


const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (e) =>{
    setData(() => {
      return {...data, [e.target.name]:e.target.value}
    });
  }

  const onSubmitHandler = () => {
    axios.post("/api/auth/" , data).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <div className='flex flex-col'>
      <input type="text" name="name" id="name" value={data.name} onChange={onChangeHandler} placeholder="Your Name Here"/>
      <input type="email" name="email" id="email" value={data.email} onChange={onChangeHandler} placeholder='Email Address' className='mt-3'/>
      <input type="password" name="password" id="password" value={data.password} onChange={onChangeHandler} placeholder='Password'/>
      <button className='w-full h-12 text-xl rounded-xl font-semibold text-white bg-gradient-to-r cursor-pointer from-blue-600 to-blue-800'>Signup</button>
      <p className="text-center text-black mt-2">Already Have a Account ? <Link to="/login" className="text-blue-500 cursor-pointer">Login here</Link></p>
    </div>
  )
}

export default Signup