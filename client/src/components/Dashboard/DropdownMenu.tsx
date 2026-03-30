import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  UserCircle,
  CreditCard,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../tailgrids/core/dropdown";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSelector";

interface DropdownMenuProps {
  toggleTheme: never;
  isDark: string;
}

const UserDropdownMenu = ({ toggleTheme, isDark }: DropdownMenuProps) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  console.log(user);

  const handleLogout = () => {
    // clear auth data
    localStorage.removeItem("token");

    // redirect
    navigate("/login");
  };

  function getInitials(name: string) {
    if (!name) return "";

    return name
      .trim()
      .split(" ") // split into words
      .filter(Boolean) // remove extra spaces
      .slice(0, 2) // take only first 2 words
      .map((word) => word[0].toUpperCase()) // get first letter
      .join("");
  }

  return (
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger
        className="
         w-[96%] flex items-center gap-3
        px-3 py-2 mx-1 my-1
        rounded-lg
        text-sm font-medium
        text-gray-700 dark:text-slate-200
        hover:bg-gray-100 dark:hover:bg-slate-800
        transition
      "
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold">
          {getInitials(user.name)}
        </div>

        <span className="flex-1 text-left">{user.name}</span>

        <ChevronDown size={16} className="opacity-60" />
      </DropdownMenuTrigger>

      {/* Dropdown */}
      <DropdownMenuContent
        className="
        w-56
        p-1.5
        bg-white dark:bg-slate-900
        border border-gray-300 dark:border-slate-800
        shadow-lg
        rounded-lg
      "
      >
        {/* Profile */}
        {/* <DropdownMenuItem
          onClick={() => navigate("/app/profile")}
          className="
          flex items-center gap-2
          px-3 py-2
          rounded-md
          cursor-pointer
          text-gray-700 dark:text-slate-200
          hover:bg-gray-100 dark:hover:bg-slate-800
        "
        >
          <UserCircle size={18} />
          My Profile
        </DropdownMenuItem> */}

        {/* Settings */}
        {/* <DropdownMenuItem
          onClick={() => navigate("/app/settings")}
          className="
          flex items-center gap-2
          px-3 py-2
          rounded-md
          cursor-pointer
          text-gray-700 dark:text-slate-200
          hover:bg-gray-100 dark:hover:bg-slate-800
        "
        >
          <Settings size={18} />
          Settings
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={toggleTheme}
          className="flex items-center gap-2
          px-3 py-2
          rounded-md
          cursor-pointer
          text-gray-700 dark:text-slate-200
          hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </DropdownMenuItem>

        {/* Subscription */}
        <DropdownMenuItem
          onClick={() => navigate("/app/pricing")}
          className="
          flex items-center gap-2
          px-3 py-2
          rounded-md
          cursor-pointer
          text-gray-700 dark:text-slate-200
          hover:bg-gray-100 dark:hover:bg-slate-800
        "
        >
          <CreditCard size={18} />
          Subscription
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 border-gray-200 dark:border-slate-800" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="
          flex items-center gap-2
          px-3 py-2
          rounded-md
          cursor-pointer
          text-red-500
          hover:bg-red-50
          dark:hover:bg-red-500/10
        "
        >
          <LogOut size={18} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
