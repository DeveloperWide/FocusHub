import { useState } from "react";
import { useDispatch } from "react-redux";
import { startSession } from "../../features/focus/focusSlice";
import { toast } from "react-toastify";

const FocusSetupModal = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState({
    title: "",
    taskId: "focus-work",
    duration: 25,
  });

  const onChangeHandler = (e) => {
    setData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const startFocus = () => {
    if (!data.title.trim() || data.duration < 1) {
      return toast.info("Please enter valid values");
    }

    dispatch(
      startSession({
        title: data.title,
        taskId: data.taskId,
        duration: data.duration * 60,
      }),
    );
  };

  return (
    <div className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col gap-6">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Start Focus Session
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Choose what you want to work on
        </p>
      </div>

      {/* Task Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">Task</label>

        <input
          type="text"
          name="title"
          value={data.title}
          autoComplete="off"
          onChange={onChangeHandler}
          placeholder="e.g. Build login API"
          className="p-3 rounded-xl bg-gray-50 border border-gray-200
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:border-transparent text-gray-800 transition"
        />
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">
          Duration (minutes)
        </label>

        <input
          type="number"
          name="duration"
          value={data.duration}
          min="1"
          onChange={onChangeHandler}
          className="w-32 p-3 rounded-xl text-center font-semibold
          bg-gray-50 border border-gray-200
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:border-transparent transition"
        />
      </div>

      {/* Start Button */}
      <button
        onClick={startFocus}
        className="mt-2 py-3 rounded-xl font-semibold text-white
        bg-indigo-600 hover:bg-indigo-700
        transition-all duration-300
        shadow-md hover:shadow-lg active:scale-[0.98]"
      >
        Start Focus
      </button>
    </div>
  );
};

export default FocusSetupModal;
