import { useState, useEffect } from "react";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { getLast7Days } from "../utils/helper";
import { axiosInstance } from "../utils/axiosInstance";

const ProductivityStreak = () => {
  const [week, setWeek] = useState([]);
  const [completedDays, setCompletedDays] = useState(new Set());
  const [streak, setStreak] = useState(0); // 🔹 new state for streak

  // Utility to calculate streak
  const calculateStreak = (completedDays) => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset();

    const localKey = (d) => {
      const shifted = new Date(d.getTime() - tzOffset * 60 * 1000);
      return shifted.toISOString().slice(0, 10);
    };

    let streakCount = 0;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    let current = new Date(now);
    if (!completedDays.has(localKey(current))) {
      current = yesterday;
      if (!completedDays.has(localKey(current))) return 0;
    }

    while (completedDays.has(localKey(current))) {
      streakCount++;
      current.setDate(current.getDate() - 1);
    }

    return streakCount;
  };

  useEffect(() => {
    setWeek(getLast7Days());
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/focus/stats/last-7-days")
      .then((res) => {
        const days = res.data?.data?.days || [];
        const dates = new Set(days.filter((d) => d.seconds > 0).map((d) => d.date));

        setCompletedDays(dates);

        // 🔹 Calculate streak right after setting completedDays
        const currentStreak = calculateStreak(dates);
        setStreak(currentStreak);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="h-full w-full flex-col flex justify-center items-center">
      <LocalFireDepartmentRoundedIcon
        sx={{ color: "#ff9501", fontSize: "200px" }}
      />
      <p className="text-xl font-bold text-gray-500 dark:text-slate-300">
        {streak}-Day Streak!
      </p>

      <div className="flex gap-3 justify-center mt-4">
        {week.map((day, idx) => {
          const isCompleted = completedDays.has(day.date);
          return (
            <div
              key={idx}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold 
                ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
            >
              {isCompleted ? (
                <CheckCircleOutlineRoundedIcon sx={{ fontSize: "50px" }} />
              ) : (
                day.label
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductivityStreak;
