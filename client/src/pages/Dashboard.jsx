import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import FocusTimeChart from "../components/Dashboard/FocusTimeChart";
import PieChart from "../components/Dashboard/PieChart";
import Quote from "../components/Dashboard/Quote";
import { selectTasks } from "../features/tasks";
import { selectUser } from "../features/auth/authSelector";
import { selectGoals } from "../features/goals";
import {
  selectFocusSession,
  selectFocusStatus,
  selectFocusTimeLeft,
} from "../features/focus/focusSelector";
import { BILLING_PLANS, getEffectivePlanId } from "../utils/billingPlans";

export default function Dashboard() {
  const user = useSelector(selectUser);
  const tasks = useSelector(selectTasks);
  const goals = useSelector(selectGoals);

  const focusSession = useSelector(selectFocusSession);
  const focusStatus = useSelector(selectFocusStatus);
  const focusTimeLeft = useSelector(selectFocusTimeLeft);

  const planId = getEffectivePlanId(user);
  const planName = BILLING_PLANS?.[planId]?.name || "Free";
  const isFree = planId === "free";

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

  const focusProgress = useMemo(() => {
    const duration = Number(focusSession?.duration || focusSession?.totalDuration || 0);
    const left = Number(focusTimeLeft || 0);
    if (!duration || !Number.isFinite(duration) || duration <= 0) return 0;
    const pct = 1 - left / duration;
    return Math.max(0, Math.min(1, pct));
  }, [focusSession, focusTimeLeft]);

  const focusTimeLabel = useMemo(() => {
    const total = Math.max(0, Number(focusTimeLeft || 0));
    const mm = Math.floor(total / 60);
    const ss = Math.floor(total % 60);
    const m = String(mm).padStart(2, "0");
    const s = String(ss).padStart(2, "0");
    return `${m}:${s}`;
  }, [focusTimeLeft]);

  const subscriptionEndsAt = user?.subscription?.currentPeriodEnd
    ? new Date(user.subscription.currentPeriodEnd)
    : null;

  return (
    <div className="-m-4 min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950 p-6">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-200 blur-3xl dark:bg-amber-500/10" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-200 blur-3xl dark:bg-indigo-500/10" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-100">
              Welcome back,{" "}
              <span className="text-indigo-700 dark:text-indigo-300">
                {user?.name || ""}
              </span>
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              Plan: <span className="font-semibold">{planName}</span> • Time left
              today: {timeLeft.hours}h {timeLeft.minutes}m
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/app/focus-timer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition"
            >
              Start focus
            </Link>
            {isFree && (
              <Link
                to="/app/pricing"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Upgrade
              </Link>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Quote />
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              Active tasks
            </p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-slate-100">
              {activeTasks.length}
            </p>
          </div>
          <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              Completed
            </p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-slate-100">
              {completedTasks.length}
            </p>
          </div>
          <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              Goals
            </p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-slate-100">
              {(goals || []).length}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  Focus Time
                </h2>
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  Last 7 days
                </span>
              </div>
              <FocusTimeChart />
            </div>

            <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  Focus Split
                </h2>
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  By goal
                </span>
              </div>
              <PieChart />
            </div>

            <div className="md:col-span-2 rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                    Today’s Main Task
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    Pick one thing. Make it count.
                  </p>
                </div>

                <Link
                  to="/app/tasks"
                  className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  View tasks
                </Link>
              </div>

              <div className="mt-5">
                {mainTask ? (
                  <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800">
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
                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300">
                    No active tasks for today. Add one and start strong.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    Your account
                  </p>
                  <p className="mt-2 text-lg font-bold text-gray-900 dark:text-slate-100 truncate">
                    {user?.email || ""}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                    Plan: <span className="font-semibold">{planName}</span>
                    {subscriptionEndsAt && !isFree ? (
                      <span className="opacity-80">
                        {" "}
                        • ends{" "}
                        {subscriptionEndsAt.toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white grid place-items-center font-extrabold">
                  {(user?.name || "F").slice(0, 1).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    Focus timer
                  </p>
                  <p className="mt-2 text-lg font-bold text-gray-900 dark:text-slate-100">
                    {focusStatus === "running" ? "In session" : "Ready"}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                    {focusStatus === "running" ? focusTimeLabel : "Start a quick sprint."}
                  </p>
                </div>

                <div
                  className="w-16 h-16 rounded-full grid place-items-center"
                  style={{
                    background: `conic-gradient(${
                      isFree ? "#4f46e5" : "#16a34a"
                    } ${Math.round(focusProgress * 360)}deg, ${
                      isFree ? "rgba(99,102,241,0.15)" : "rgba(22,163,74,0.15)"
                    } 0deg)`,
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-950 grid place-items-center text-xs font-bold text-gray-800 dark:text-slate-100 border border-gray-200 dark:border-slate-800">
                    {focusStatus === "running" ? focusTimeLabel : "Start"}
                  </div>
                </div>
              </div>

              <Link
                to="/app/focus-timer"
                className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition"
              >
                Open timer
              </Link>
            </div>

            {isFree ? (
              <div className="rounded-3xl overflow-hidden shadow-xl border border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  Upgrade preview
                </p>
                <p className="mt-2 text-lg font-extrabold">
                  Unlock higher limits + early access
                </p>
                <p className="mt-2 text-sm text-white/90">
                  More goals, more daily tasks, and new features as we ship them.
                </p>
                <Link
                  to="/app/pricing"
                  className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 rounded-2xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition"
                >
                  See pricing
                </Link>
              </div>
            ) : (
              <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  Thanks
                </p>
                <p className="mt-2 text-lg font-extrabold text-gray-900 dark:text-slate-100">
                  You’re supporting FocusHub
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                  New features are coming — you’ll get access first.
                </p>
                <Link
                  to="/app/pricing"
                  className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition"
                >
                  Manage plan
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
