import React from "react";
import FocusTimeChart from "../components/FocusTimeChart";
import { getUser } from "../utils/auth";
import PieChart from "../components/PieChart";
import Quote from "../components/Quote";

export default function Dashboard() {
  const user = getUser();
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 mb-6">
        Welcome back, <span className="text-indigo-600">{user.name}</span> 👋
      </h1>
      
      <Quote />

      {/* Top Grid - Profile & Focus Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        
        {/* Profile Card */}
        <div
          className="profile h-120 md:h-auto relative flex flex-col justify-end rounded-xl overflow-hidden shadow-lg mx-4 border border-gray-300"
          style={{
            backgroundImage: `url(${user.profileImage.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay Layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/80 to-transparent" />

          {/* Text Layer */}
          <div className="relative z-10 p-4">
            <div className="user-name text-white text-xl font-semibold">{user.name}</div>
            <div className="user-email text-white text-sm opacity-90">{user.email}</div>
          </div>
        </div>

        {/* Focus Time Card */}
        <div className="rounded-2xl shadow-lg bg-white border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Focus Time</h2>
            <span className="text-sm text-gray-400">Last 7 Days</span>
          </div>
          <FocusTimeChart />
        </div>
         <div className="rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4 p-3">
            <h2 className="text-xl font-semibold text-gray-700">Task Information</h2>
          </div>
          <PieChart />
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Tasks</h2>
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3 hover:shadow-xl transition-shadow">
          {user.tasks?.length > 0 ? (
            user.tasks.map((task, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors"
              >
                <span className="text-gray-800">{task}</span>
                <span className="text-sm text-gray-500">Pending</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tasks yet. Add some to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
}
