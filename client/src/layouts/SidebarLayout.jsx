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

const SIDEBAR_WIDTH = "w-64"; // 16rem

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
  className={`fixed top-0 left-0 z-40 h-full ${SIDEBAR_WIDTH} bg-gray-50 dark:bg-[#232428] transform transition-transform duration-300 ease-in-out
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
>
  <div className="h-full px-4 py-4 flex flex-col justify-between">
    {/* Top Header */}
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl text-indigo-500 font-semibold flex items-center gap-1">
          FocusHub <BarChartRoundedIcon className="text-blue-500" />
        </h2>
        <button
          onClick={toggleSidebar}
          className="sm:hidden text-gray-400 hover:text-gray-900 dark:hover:text-white hover:cursor-pointer"
        >
          <ClearRoundedIcon sx={{ fontSize: 30 }} />
        </button>
      </div>

      {/* Top Navigation Items */}
      <ul className="mt-6 space-y-2 font-medium">
        {[
          { label: "Dashboard", icon: <QueryStatsRoundedIcon />, href: "/app/dashboard" },
          { label: "Tasks", icon: <AddTaskRoundedIcon />, href: "/app/tasks", badge: "Pro" },
          { label: "Goals", icon: <OutlinedFlagRoundedIcon />, href: "/app/goals", badge: 3 },
          { label: "Time", icon: <AccessAlarmsRoundedIcon />, href: "/app/time" },
          { label: "Calendar", icon: <CalendarMonthRoundedIcon />, href: "/app/calendar" },
          { label: "Profile", icon: <PersonIcon />, href: "/app/profile" },
        ].map((item, idx) => (
          <li key={idx}>
            <a
              href={item.href}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 text-sm font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-gray-900 dark:text-gray-300">
                  {item.badge}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* Bottom Navigation Items */}
    <ul className="space-y-2 font-medium">
      {[
        { label: "Settings", icon: <SettingsIcon />, href: "/app/settings" },
        { label: "Log Out", icon: <LogoutIcon />, href: "/app/logout" },
      ].map((item, idx) => (
        <li key={idx}>
          <a
            href={item.href}
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </a>
        </li>
      ))}
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
