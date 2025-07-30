import { Link } from "react-router-dom"


const Signup = () => {
  return (
    <div className='flex flex-col'>
      <input type="email" name="email" id="email" placeholder='Email Address' className='mt-3'/>
      <input type="password" name="password" id="password" placeholder='Password'/>
      <input type="password" name="confirmPassword" id="confirmPassword" placeholder='Confirm Password'/>
      <button className='w-full h-12 text-xl rounded-xl font-semibold text-white bg-gradient-to-r cursor-pointer from-blue-600 to-blue-800'>Signup</button>
      <p className="text-center text-black mt-2">Already Have a Account ? <Link to="/login" className="text-blue-500 cursor-pointer">Login here</Link></p>
    </div>
  )
}

export default Signup