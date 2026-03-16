import { useSelector } from "react-redux";
import { selectGoals } from "../../features/goals";

const GoalHeader = () => {
  const goals = useSelector(selectGoals);

  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        {goals.length < 3 ? "Target" : "Your"}{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-400">
          Ambitions
        </span>
      </h1>
      <p className="text-slate-400 dark:text-slate-300 text-sm">
        {goals.length}/3 slots filled
      </p>
      {/* Simple Progress Bar */}
      <div className="w-24 h-1 bg-slate-200 dark:bg-slate-800 mx-auto mt-4 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-400 transition-all duration-500"
          style={{ width: `${(goals.length / 3) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default GoalHeader;
