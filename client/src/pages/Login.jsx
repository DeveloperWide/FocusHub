import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div>
        <div>
            <input type="email" name="email" id="email" className='border mt-4 w-full px-3 py-2 outline-none rounded-2xl border-gray-400' placeholder='Email Address'/>
            <input type="password" name="email" id="email" className='border my-1 mb-0 w-full px-3 py-2 outline-none rounded-2xl border-gray-400' placeholder='Password'/>
            <p className='text-blue-500 capitalize ms-2 my-0.5 cursor-pointer`'>Forgot password?</p>
            <button className='w-full my-2 px-3 py-2 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl font-semibold text-xl text-white'>Login</button>
            <p className='text-center text-black mt-2'>Not a member? <Link to={"/signup"} className='text-blue-500 cursor-pointer'>Signup now</Link></p>
        </div>
    </div>
  )
}

export default Login