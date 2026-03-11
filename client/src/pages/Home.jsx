import { Link, Outlet, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 px-4">
      {/* Logo */}
      <h1 className="text-5xl font-bold tracking-tight mb-6">FocusHub</h1>

      {/* Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl px-8 py-6">
        <h2 className="text-center text-xl font-semibold text-green-700 mb-5">
          Make Your Day Productive
        </h2>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          <Link
            to="/login"
            className={`flex-1 text-center py-2 rounded-lg font-medium transition ${
              location.pathname === "/login"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className={`flex-1 text-center py-2 rounded-lg font-medium transition ${
              location.pathname === "/signup"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
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
