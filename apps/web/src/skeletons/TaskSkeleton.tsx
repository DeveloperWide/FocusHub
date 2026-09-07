import Skeleton from "react-loading-skeleton";
import { useTheme } from "../context/ThemeContext";

const TaskSkeleton = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const baseColor = isDark ? "#1e293b" : "#e5e7eb";
  const highlightColor = isDark ? "#334155" : "#f3f4f6";

  return (
    <div className="flex items-center justify-between border-l-4 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-xl my-4">
      <div className="flex items-center gap-4">
        {/* priority dot */}
        <Skeleton
          circle
          width={8}
          height={8}
          baseColor={baseColor}
          highlightColor={highlightColor}
        />

        <div className="flex flex-col gap-2">
          <Skeleton
            width={60}
            height={10}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
          <Skeleton
            width={180}
            height={16}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Skeleton
          width={32}
          height={32}
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
        <Skeleton
          width={32}
          height={32}
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
      </div>
    </div>
  );
};

export default TaskSkeleton;
