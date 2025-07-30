import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import BgImage from "../assets/focus.jpeg"

const Home = () => {
  const location = useLocation();

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-green-100 to-blue-100"
    >
      <h2 className="text-4xl font-semibold">FocusHub</h2>
      <p className="font-cursive text-lg py-1.5 text-green-800">Make Your Day Productive</p>

      <div className="card w-90 h-100 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl px-10 py-5">
        <div className="btns flex justify-center items-center border border-[#0002] rounded-2xl h-11 w-[99%]">
          <button className={`login-btn px-4 py-2 rounded-lg ${location.pathname === "/login" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            <Link to="/login">Login</Link>
          </button>
          <button className={`signup-btn px-4 py-2 rounded-lg ml-2 ${location.pathname === "/signup" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            <Link to="/signup">Signup</Link>
          </button>
        </div>

        <div className="form mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
