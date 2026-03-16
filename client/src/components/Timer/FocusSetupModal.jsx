import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startSession } from "../../features/focus/focusSlice";
import { toast } from "react-toastify";
import { selectGoals } from "../../features/goals";
import { selectFocusSettings } from "../../features/focus/focusSelector";

const FocusSetupModal = () => {
  const dispatch = useDispatch();
  const goals = useSelector(selectGoals);
  const focusSettings = useSelector(selectFocusSettings);

  const [data, setData] = useState({
    title: "",
    linkType: "personal",
    goalTag: "",
    duration: focusSettings.focusMinutes || 25,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    shortBreakMinutes: focusSettings.shortBreakMinutes || 5,
    longBreakMinutes: focusSettings.longBreakMinutes || 15,
    longBreakEvery: focusSettings.longBreakEvery || 4,
    autoNext: Boolean(focusSettings.autoNext),
    notificationsEnabled: Boolean(focusSettings.notificationsEnabled),
    soundEnabled: focusSettings.soundEnabled !== false,
  });

  useEffect(() => {
    setData((p) => ({ ...p, duration: focusSettings.focusMinutes || p.duration }));
    setSettings((p) => ({
      ...p,
      shortBreakMinutes: focusSettings.shortBreakMinutes ?? p.shortBreakMinutes,
      longBreakMinutes: focusSettings.longBreakMinutes ?? p.longBreakMinutes,
      longBreakEvery: focusSettings.longBreakEvery ?? p.longBreakEvery,
      autoNext: focusSettings.autoNext ?? p.autoNext,
      notificationsEnabled:
        focusSettings.notificationsEnabled ?? p.notificationsEnabled,
      soundEnabled: focusSettings.soundEnabled ?? p.soundEnabled,
    }));
  }, [focusSettings]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setData((p) => {
      if (name === "linkType") {
        return {
          ...p,
          linkType: value,
          goalTag: value === "personal" ? "" : p.goalTag,
        };
      }

      return {
        ...p,
        [name]: value,
      };
    });
  };

  const onSettingsChange = (e) => {
    const { name, type, checked, value } = e.target;

    setSettings((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const startFocus = () => {
    if (!data.title.trim() || data.duration < 1) {
      return toast.info("Please enter valid values");
    }

    if (data.linkType === "goal" && !data.goalTag) {
      return toast.info("Please select a goal tag");
    }

    if (
      settings.notificationsEnabled &&
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().catch(() => {});
    }

    dispatch(
      startSession({
        title: data.title.trim(),
        goalTag: data.linkType === "goal" ? data.goalTag : "",
        duration: data.duration * 60,
        mode: "focus",
        resetFlow: true,
        settings: {
          focusMinutes: Math.max(1, Number(data.duration) || 25),
          shortBreakMinutes: Math.max(1, Number(settings.shortBreakMinutes) || 5),
          longBreakMinutes: Math.max(1, Number(settings.longBreakMinutes) || 15),
          longBreakEvery: Math.max(1, Number(settings.longBreakEvery) || 4),
          autoNext: Boolean(settings.autoNext),
          notificationsEnabled: Boolean(settings.notificationsEnabled),
          soundEnabled: Boolean(settings.soundEnabled),
        },
      }),
    );
  };

  const presetDurations = [15, 25, 45, 60];

  return (
    <section className="w-full h-full flex flex-col ">
      <div className="flex w-full h-full justify-center items-center ">
        <div className="w-full max-w-5xl  grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ms-7 ">
          {/* Left */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100">
                Focus Timer
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300">
                Start a session in one click. Personal by default, or connect it
                to a goal.
              </p>
            </div>

            {/* Focus Title */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                Focus title
              </label>

              <input
                type="text"
                name="title"
                value={data.title}
                autoComplete="off"
                onChange={onChangeHandler}
                placeholder="Build login API"
                className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-400 transition"
              />
            </div>

            {/* Connect */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                Connect
              </label>

              <div className="inline-flex w-full sm:w-fit rounded-2xl p-1 bg-white/70 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() =>
                    setData((p) => ({
                      ...p,
                      linkType: "personal",
                      goalTag: "",
                    }))
                  }
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    data.linkType === "personal"
                      ? "bg-gray-900 text-white dark:bg-indigo-600"
                      : "text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  Personal
                </button>

                <button
                  type="button"
                  onClick={() => setData((p) => ({ ...p, linkType: "goal" }))}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    data.linkType === "goal"
                      ? "bg-gray-900 text-white dark:bg-indigo-600"
                      : "text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  Goal
                </button>
              </div>

              {data.linkType === "goal" && (
                <select
                  name="goalTag"
                  value={data.goalTag}
                  onChange={onChangeHandler}
                  className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-slate-100 transition"
                >
                  <option value="">Select a goal tag</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.tag}>
                      #{g.tag}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">
            {/* Preset Duration */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                Duration
              </label>

              <div className="flex gap-3 flex-wrap">
                {presetDurations.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setData((p) => ({
                        ...p,
                        duration: d,
                      }))
                    }
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      data.duration === d
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white/80 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Duration */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-slate-300">
                Custom
              </span>

              <input
                type="number"
                name="duration"
                value={data.duration}
                min="1"
                onChange={onChangeHandler}
                className="w-28 px-4 py-2 text-center rounded-2xl bg-white/70 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-slate-100"
              />

              <span className="text-sm text-gray-600 dark:text-slate-300">
                minutes
              </span>
            </div>

            {/* Pomodoro Settings */}
            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 p-4">
              <button
                type="button"
                onClick={() => setShowSettings((p) => !p)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                  Pomodoro Settings
                </span>
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  {showSettings ? "Hide" : "Show"}
                </span>
              </button>

              {showSettings && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-slate-300">
                      Short break (min)
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="shortBreakMinutes"
                      value={settings.shortBreakMinutes}
                      onChange={onSettingsChange}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-slate-300">
                      Long break (min)
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="longBreakMinutes"
                      value={settings.longBreakMinutes}
                      onChange={onSettingsChange}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-slate-300">
                      Long break every
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="longBreakEvery"
                      value={settings.longBreakEvery}
                      onChange={onSettingsChange}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-5">
                    <input
                      id="autoNext"
                      type="checkbox"
                      name="autoNext"
                      checked={settings.autoNext}
                      onChange={onSettingsChange}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    <label
                      htmlFor="autoNext"
                      className="text-sm text-gray-700 dark:text-slate-200"
                    >
                      Auto-next
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="soundEnabled"
                      type="checkbox"
                      name="soundEnabled"
                      checked={settings.soundEnabled}
                      onChange={onSettingsChange}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    <label
                      htmlFor="soundEnabled"
                      className="text-sm text-gray-700 dark:text-slate-200"
                    >
                      Sound
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="notificationsEnabled"
                      type="checkbox"
                      name="notificationsEnabled"
                      checked={settings.notificationsEnabled}
                      onChange={onSettingsChange}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    <label
                      htmlFor="notificationsEnabled"
                      className="text-sm text-gray-700 dark:text-slate-200"
                    >
                      Notifications
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Start Button */}
            <button
              onClick={startFocus}
              className="w-full py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 transition shadow-[0_16px_40px_rgba(79,70,229,0.35)] active:scale-[0.99]"
            >
              Start Focus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FocusSetupModal;
