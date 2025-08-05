import { useState } from 'react';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import PersonIcon from '@mui/icons-material/Person';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import AccessAlarmsRoundedIcon from '@mui/icons-material/AccessAlarmsRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet } from 'react-router-dom';
import { getUser } from '../utils/auth';

const SIDEBAR_WIDTH = "w-64"; // 16rem

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = getUser()
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
  className={`fixed top-0 left-0 z-40 h-full ${SIDEBAR_WIDTH} 
    bg-black/40 dark:bg-[#000]
    backdrop-blur-lg border-r border-white/10 shadow-xl 
    transform transition-transform duration-500 ease-in-out
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
>
  <div className="h-full py-4 flex flex-col justify-between">
    {/* Top Header */}
    <div>
      <div className="flex justify-between items-center px-4">
        <h2 className="text-3xl font-bold text-white drop-shadow-md flex items-center gap-1">
          FocusHub <BarChartRoundedIcon className="text-blue-300" />
        </h2>
        <button
          onClick={toggleSidebar}
          className="sm:hidden text-gray-200 hover:text-white transition-transform hover:scale-110"
        >
        <ClearRoundedIcon sx={{ fontSize: 30 }} />
        </button>
      </div>

      {/* Profile Section */}
      <div className="profile-card flex flex-col justify-center items-center w-full mt-4 pb-4 border-b border-white/20">
        <img
          src={`${user.profileImage.url}`}
          className="rounded-full h-28 w-28 border-2 border-white/30 shadow-lg hover:scale-105 transition-transform duration-300"
          alt="Profile"
        />
        <h2 className="text-xl font-semibold text-white mt-2">{user.name}</h2>
        <p className="text-gray-300 text-sm">{user.email}</p>
      </div>

      {/* Navigation Items */}
      <ul className="mt-6 space-y-2 font-medium">
        {[
          { label: "Dashboard", icon: <QueryStatsRoundedIcon />, href: "/app/dashboard" },
          { label: "Tasks", icon: <AddTaskRoundedIcon />, href: "/app/tasks", badge: "Pro" },
          { label: "Goals", icon: <OutlinedFlagRoundedIcon />, href: "/app/goals", badge: 3 },
          { label: "Time", icon: <AccessAlarmsRoundedIcon />, href: "/app/time" },
          { label: "Profile", icon: <PersonIcon />, href: "/app/profile" },
        ].map((item, idx) => (
          <li key={idx} className="px-4">
            <a
              href={item.href}
              className="flex items-center p-2 text-white rounded-lg 
                hover:bg-white/20 hover:backdrop-blur-md transition-all duration-300 ease-in-out 
                hover:shadow-md hover:scale-[1.02]"
            >
              <span className="text-blue-300">{item.icon}</span>
              <span className="ml-3">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 text-sm font-medium bg-blue-500/30 text-white rounded-full backdrop-blur-sm">
                  {item.badge}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* Bottom Items */}
    <ul className="space-y-2 font-medium border-t border-white/10 pt-3">
      <li className="px-4">
        <a
          href="/app/logout"
          className="flex items-center p-2 text-white rounded-lg 
            hover:bg-red-400/30 hover:backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-[1.02]"
        >
          <LogoutIcon className="text-red-300" />
          <span className="ml-3">Log Out</span>
        </a>
      </li>
    </ul>
  </div>
</aside>



      {/* Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "sm:ml-0" : ""} sm:ml-64`}
      >
        {/* Toggle Button for small screens */}
        <button
          onClick={toggleSidebar}
          className="sm:hidden p-3 text-gray-500 hover:bg-gray-100 dark:text-gray-400  hover:cursor-pointer w-10 h-8 mb-4 mx-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            />
          </svg>
        </button>

        {/* Main App Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
