import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  createGoal,
  deleteGoal,
  fetchGoals,
  selectGoalError,
  selectGoalLoading,
  selectGoals,
} from "../features/goals/index.js";
import { updateGoal } from "../features/goals/goalThunk.js";
import GoalInput from "../components/Goal/GoalInput.jsx";
import GoalHeader from "../components/Goal/GoalHeader.jsx";
import GoalList from "../components/Goal/GoalList.jsx";
import { useState } from "react";

const Goal = () => {
  const [editingGoal, setEditingGoal] = useState(null);
  const dispatch = useDispatch();

  const goals = useSelector(selectGoals);
  const loading = useSelector(selectGoalLoading);
  const error = useSelector(selectGoalError);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const addGoalHandler = (goal, setGoal) => {
    if (!goal.title.trim() || !goal.tag.trim()) {
      toast.error("Both fields are Required");
      return;
    }

    dispatch(createGoal(goal))
      .unwrap()
      .then(() => {
        toast.success("Goal Created");
        setGoal(() => {
          return { title: "", tag: "" };
        });
      })
      .catch(() => toast.error("Failed"));
  };

  const deleteGoalHandler = (goalId) => {
    dispatch(deleteGoal(goalId))
      .unwrap()
      .then(() => {
        toast.success("Deleted Successfully");
      })
      .catch(() => {
        toast.error("Failed to Delete");
      });
  };

  const updateGoalHandler = (goalId, goal) => {
    dispatch(updateGoal({ goalId, data: goal }))
      .unwrap()
      .then(() => {
        toast.success("Goal Updated Successfully");
      })
      .catch(() => {
        toast.error("Goal Update Failed");
      });
  };

  if (loading) return <p>Loading Goals...</p>;

  if (error) return <p>{error}</p>;
  // const isTrue = goals.length < 3 && editMode == true;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header Section */}
        <GoalHeader />

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8">
          {/* Input Section */}
          {(goals.length < 3 || editingGoal) && (
            <div className="space-y-4 mb-10">
              <GoalInput
                addGoalHandler={addGoalHandler}
                updateGoalHandler={updateGoalHandler}
                editingGoal={editingGoal}
                setEditingGoal={setEditingGoal}
              />
            </div>
          )}

          {/* Goals List */}
          <GoalList
            setEditingGoal={setEditingGoal}
            updateGoalHandler={updateGoalHandler}
            deleteGoalHandler={deleteGoalHandler}
          />
        </div>

        {/* Footer hint */}
        <p className="text-center text-slate-600 text-xs mt-8 uppercase tracking-tighter">
          Focus on the top 3. Ignore the rest.
        </p>
      </div>
    </div>
  );
};

export default Goal;
