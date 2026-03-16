import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import FocusTimeChart from "../components/Dashboard/FocusTimeChart";
import PieChart from "../components/Dashboard/PieChart";
import Quote from "../components/Dashboard/Quote";
import { selectTasks } from "../features/tasks";
import { selectUser } from "../features/auth/authSelector";

export default function Dashboard() {
  const user = useSelector(selectUser);
  const tasks = useSelector(selectTasks);

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const diffMs = Math.max(0, midnight.getTime() - now.getTime());
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);

      setTimeLeft({ hours, minutes });
    };

    compute();
    const id = setInterval(compute, 30000);
    return () => clearInterval(id);
  }, []);

  const { activeTasks, completedTasks, mainTask } = useMemo(() => {
    const active = (tasks || []).filter((t) => !t.isComplete);
    const completed = (tasks || []).filter((t) => t.isComplete);

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sorted = [...active].sort((a, b) => {
      const pa = priorityOrder[a.priority] || 99;
      const pb = priorityOrder[b.priority] || 99;
      if (pa !== pb) return pa - pb;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return {
      activeTasks: active,
      completedTasks: completed,
      mainTask: sorted[0] || null,
    };
  }, [tasks]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      {/* Welcome Header */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-slate-100 mb-6">
        Welcome back,{" "}
        <span className="text-indigo-600">{user?.name || ""}</span> 👋
      </h1>

      <Quote />

	      {/* Top Grid - Profile & Focus Time */}
	      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {/* Profile Card */}
        {/* <div
          className="profile h-120 md:h-auto relative flex flex-col justify-end rounded-xl overflow-hidden shadow-lg mx-4 border border-gray-300"
          style={{
            backgroundImage: `url(${user.profileImage.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/80 to-transparent" />

          <div className="relative z-10 p-4">
            <div className="user-name text-white text-xl font-semibold">{user.name}</div>
            <div className="user-email text-white text-sm opacity-90">{user.email}</div>
          </div>
        </div> */}

        {/* Focus Time Card */}
        <div className="rounded-2xl shadow-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-200">
              Focus Time
            </h2>
            <span className="text-sm text-gray-400 dark:text-slate-400">
              Last 7 Days
            </span>
          </div>
          <FocusTimeChart />
        </div>
	        <div className="rounded-2xl shadow-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
	          <div className="flex items-center justify-between mb-4 p-3">
	            <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-200">
	              Focus Split
	            </h2>
	            <span className="text-sm text-gray-400 dark:text-slate-400">
	              Last 7 Days
	            </span>
	          </div>
	          <PieChart />
	        </div>
	      </div>

	      {/* Today */}
	      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
	        <div className="lg:col-span-2 rounded-2xl shadow-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 hover:shadow-xl transition-shadow">
	          <div className="flex items-start justify-between gap-3">
	            <div>
	              <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
	                Today’s Main Task
	              </h2>
	              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
	                Time left today: {timeLeft.hours}h {timeLeft.minutes}m
	              </p>
	            </div>

	            <Link
	              to="/app/tasks"
	              className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
	            >
	              View Tasks
	            </Link>
	          </div>

	          <div className="mt-5">
	            {mainTask ? (
	              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800">
	                <div className="min-w-0">
	                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-400">
	                    {mainTask.priority} priority • {mainTask.type}
	                  </p>
	                  <p className="text-gray-900 dark:text-slate-100 font-semibold truncate">
	                    {mainTask.title}
	                  </p>
	                  {mainTask.tag && (
	                    <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
	                      #{mainTask.tag}
	                    </p>
	                  )}
	                </div>

	                <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">
	                  Next up
	                </span>
	              </div>
	            ) : (
	              <div className="p-6 rounded-xl bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300">
	                No active tasks for today. Add one and make it count.
	              </div>
	            )}
	          </div>
	        </div>

	        <div className="rounded-2xl shadow-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 hover:shadow-xl transition-shadow">
	          <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
	            Task Summary
	          </h2>
	          <div className="mt-4 space-y-3">
	            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800">
	              <span className="text-sm text-gray-600 dark:text-slate-300">
	                Active
	              </span>
	              <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
	                {activeTasks.length}
	              </span>
	            </div>
	            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800">
	              <span className="text-sm text-gray-600 dark:text-slate-300">
	                Completed
	              </span>
	              <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
	                {completedTasks.length}
	              </span>
	            </div>
	            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800">
	              <span className="text-sm text-gray-600 dark:text-slate-300">
	                Total
	              </span>
	              <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
	                {tasks.length}
	              </span>
	            </div>
	          </div>
	        </div>
	      </div>
    </div>
  );
}
