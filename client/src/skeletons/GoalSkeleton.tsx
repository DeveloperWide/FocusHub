import Skeleton from "react-loading-skeleton";
import { useTheme } from "../context/ThemeContext";

const GoalSkeleton = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const baseColor = isDark ? "#1e293b" : "#e5e7eb";
  const highlightColor = isDark ? "#334155" : "#f3f4f6";

  return (
    <div className="flex items-center justify-between bg-gray-300 dark:bg-slate-800 p-4 my-4 rounded-2xl border border-gray-200 dark:border-slate-700">
      <div className="flex items-center">
        {/* dot */}
        <Skeleton
          circle
          width={8}
          height={8}
          baseColor={baseColor}
          highlightColor={highlightColor}
          style={{ marginRight: 12 }}
        />

        <div className="flex flex-col">
          <Skeleton
            width={60}
            height={7}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
          <Skeleton
            width={150}
            height={10}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      </div>

      {/* buttons */}
      <div className="flex gap-2">
        <Skeleton
          width={27}
          height={27}
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
        <Skeleton
          width={27}
          height={27}
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
      </div>
    </div>
  );
};

export default GoalSkeleton;
