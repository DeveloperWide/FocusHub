import { Link, Outlet, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 dark:from-slate-950 dark:to-slate-900 px-4">
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800 text-gray-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800/70 transition"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Logo */}
      <h1 className="text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-slate-100">
        FocusHub
      </h1>

      {/* Card */}
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/70 border border-white/40 dark:border-slate-800 backdrop-blur-md shadow-xl rounded-2xl px-8 py-6">
        <h2 className="text-center text-xl font-semibold text-green-700 dark:text-green-400 mb-5">
          Make Your Day Productive
        </h2>

        {/* Toggle */}
        <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1 mb-5">
          <Link
            to="/login"
            className={`flex-1 text-center py-2 rounded-lg font-medium transition ${
              location.pathname === "/login"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-slate-200"
            }`}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className={`flex-1 text-center py-2 rounded-lg font-medium transition ${
              location.pathname === "/signup"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-slate-200"
            }`}
          >
            Signup
          </Link>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Home;
