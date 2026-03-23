import { useState } from "react";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import OutlinedFlagRoundedIcon from "@mui/icons-material/OutlinedFlagRounded";
import AddTaskRoundedIcon from "@mui/icons-material/AddTaskRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import AccessAlarmsRoundedIcon from "@mui/icons-material/AccessAlarmsRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, Outlet } from "react-router-dom";
import { Hourglass, Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import UserDropdownMenu from "../components/Dashboard/DropdownMenu";
import { useFocusAutoSave } from "../hooks/useFocusAutoSave";
const SIDEBAR_WIDTH = "w-64";

const navItems = [
  {
    label: "Dashboard",
    icon: <QueryStatsRoundedIcon fontSize="small" />,
    href: "/app/dashboard",
  },
  {
    label: "Tasks",
    icon: <AddTaskRoundedIcon fontSize="small" />,
    href: "/app/tasks",
    badge: "Pro",
  },
  {
    label: "Goals",
    icon: <OutlinedFlagRoundedIcon fontSize="small" />,
    href: "/app/goals",
    badge: 3,
  },
  {
    label: "Time",
    icon: <AccessAlarmsRoundedIcon fontSize="small" />,
    href: "/app/time",
  },
  {
    label: "Focus Timer",
    icon: <Hourglass size={18} />,
    href: "/app/focus-timer",
  },
  // {
  //   label: "Pricing",
  //   icon: <Sparkles size={18} />,
  //   href: "/app/pricing",
  //   badge: "New",
  // },
];

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useFocusAutoSave();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-slate-950">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:relative
        top-0 left-0 z-40 h-full
        ${SIDEBAR_WIDTH}

        bg-white dark:bg-slate-900
        border-r border-gray-200 dark:border-slate-800
        shadow-lg

        transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <div className="h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex-1">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  F
                </div>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  FocusHub
                </h2>
              </div>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                <ClearRoundedIcon />
              </button>
            </div>

            <div className="border-b border-gray-200 dark:border-slate-800" />

            {/* Navigation */}
            <nav className="mt-4 px-3 space-y-1">
              {navItems.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.href}
                  className={({ isActive }) =>
                    `
                    flex items-center
                    px-3 py-2.5
                    text-sm font-medium
                    rounded-lg
                    transition

                    ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
                        : "text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                    }
                  `
                  }
                >
                  <span className="mr-3 text-gray-400 dark:text-slate-500">
                    {item.icon}
                  </span>

                  {item.label}

                  {item.badge && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-400 dark:border-slate-800 space-y-2">
            {/* Add User Profile with Dropdown */}
            <UserDropdownMenu toggleTheme={toggleTheme} isDark={isDark} />
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center h-14 px-4 border-b shadow-sm bg-white dark:bg-slate-900 dark:border-slate-800">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            ☰
          </button>

          <span className="ml-4 font-semibold text-gray-800 dark:text-slate-200">
            FocusHub
          </span>

          <button
            onClick={toggleTheme}
            className="ml-auto p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
