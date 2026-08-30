import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { label: "Home", to: "/", end: true },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Contact", to: "/contact" },
  { label: "Login", to: "/login" },
  { label: "Signup", to: "/signup" },
];

const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-indigo-700 dark:text-indigo-300"
        : "text-gray-600 hover:text-gray-950 dark:text-slate-300 dark:hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-gray-950 dark:text-white" aria-label="FocusHub home">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm text-white">F</span>
            <span>FocusHub</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Public navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button type="button" onClick={toggleTheme} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Toggle dark mode">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800">Login</Link>
            <Link to="/signup" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">Get Started</Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button type="button" onClick={toggleTheme} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Toggle dark mode">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label="Toggle navigation menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-navigation" className="border-t border-gray-200 px-4 py-4 dark:border-slate-800 md:hidden" aria-label="Mobile public navigation">
            <div className="mx-auto grid max-w-7xl gap-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200" : "text-gray-700 dark:text-slate-200"}`}>
                  {item.label}
                </NavLink>
              ))}
              <Link to="/login" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200">Login</Link>
              <Link to="/signup" className="rounded-xl bg-indigo-600 px-3 py-2.5 text-center text-sm font-semibold text-white">Get Started</Link>
            </div>
          </nav>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="border-t border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-bold"><span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 text-xs text-white">F</span>FocusHub</div>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-slate-300">A focused workspace for organizing tasks, goals, and time.</p>
          </div>
          <nav className="flex max-w-xl flex-wrap gap-x-5 gap-y-3" aria-label="Footer navigation">
            {footerLinks.map((item) => <Link key={item.to} to={item.to} className="text-sm text-gray-600 hover:text-indigo-700 dark:text-slate-300 dark:hover:text-indigo-300">{item.label}</Link>)}
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
