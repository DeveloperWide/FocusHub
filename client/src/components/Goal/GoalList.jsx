import { useSelector } from "react-redux";
import { selectGoals } from "../../features/goals";
import Buttons from "../Buttons";

const GoalList = ({ deleteGoalHandler, setEditingGoal }) => {
  const goals = useSelector(selectGoals);
  return (
    <div className="space-y-4">
      {goals.length === 0 ? (
        <div className="py-10 text-center">
          <div className="text-slate-600 mb-2">⚡</div>
          <p className="text-slate-500 font-medium">
            Your vision board is empty.
          </p>
        </div>
      ) : (
        goals.map((goal) => (
          <div
            key={goal.id}
            className="group relative flex items-center justify-between  bg-gray-200 p-4 rounded-2xl border border-gray-200 hover:bg-gray-300 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-emerald-800 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-green-800/80">
                  {goal.tag}
                </span>
                <span className="text-gray-800 font-semibold capitalize">
                  {goal.title}
                </span>
              </div>
            </div>
            <Buttons
              goal={goal}
              deleteHandler={deleteGoalHandler}
              setEditingGoal={setEditingGoal}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default GoalList;
