import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const Home = () => {
  const location = useLocation();

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-green-100 to-blue-100"
    >
      <h2 className="font-cursive signup-heading text-5xl py-3">FocusHub</h2>
      <div className="card w-90 h-auto my-2 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl px-10 py-5">
      <h2 className=' font-cursive w-full text-center text-2xl mb-4 font-semibold text-green-800'>Make Your Day Productive</h2>
        <div className="btns flex justify-center items-center border border-[#0002] rounded-2xl h-11 w-[99%]">
          <Link className={`login-btn px-4 py-2 rounded-lg ${location.pathname === "/login" ? "bg-gradient-to-r from-blue-800 to-blue-600 text-white" : "bg-transparent"}`} to="/login">
            Login</Link>
          <Link className={`signup-btn px-4 py-2 rounded-lg ml-2 ${location.pathname === "/signup" ? "bg-gradient-to-r from-blue-800 to-blue-600 text-white" : "bg-transparent"}`}   to="/signup">
            Signup</Link>
        </div>

        <div className="form mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
