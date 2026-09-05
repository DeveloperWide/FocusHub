import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  createGoal,
  deleteGoal,
  fetchGoals,
  selectGoalLoading,
  selectGoals,
} from "../features/goals/index";
import { updateGoal } from "../features/goals/goalThunk";
import GoalInput from "../components/Goal/GoalInput";
import GoalHeader from "../components/Goal/GoalHeader";
import GoalList from "../components/Goal/GoalList";
import { useState } from "react";
import GoalSkeleton from "../skeletons/GoalSkeleton";
import { selectUser } from "../features/auth/authSelector";
import { getEffectivePlanId, getEntitlements } from "../utils/billingPlans";
import { Link } from "react-router-dom";

const Goal = () => {
  const [editingGoal, setEditingGoal] = useState(null);
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const goals = useAppSelector(selectGoals);
  const loading = useAppSelector(selectGoalLoading);

  const planId = getEffectivePlanId(user);
  const entitlements = getEntitlements(planId);
  const goalsLimit = entitlements?.goals;
  const canAddMoreGoals = goalsLimit == null || goals.length < goalsLimit;

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const addGoalHandler = (goal, setGoal) => {
    if (!goal.title.trim() || !goal.tag.trim()) {
      toast.error("Both fields are Required");
      return;
    }

    const data = {
      title: goal.title.trim(),
      tag: goal.tag.trim(),
    };

    dispatch(createGoal(data))
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

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-xl mx-auto">
        {/* Header Section */}
        <GoalHeader />
        {!loading && !canAddMoreGoals && planId === "free" && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200 p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                Goal limit reached ({goals.length}/{goalsLimit}).
              </p>
              <p className="text-xs opacity-90 mt-1">
                Upgrade to unlock more goals and higher daily task limits.
              </p>
            </div>
            <Link
              to="/app/pricing"
              className="shrink-0 inline-flex items-center justify-center px-3 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition"
            >
              See pricing
            </Link>
          </div>
        )}
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => <GoalSkeleton key={i} />)
        ) : (
          <div className="backdrop-blur-xl bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 shadow-2xl rounded-3xl p-8">
            {/* Input Section */}
            {(canAddMoreGoals || editingGoal) && (
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
              deleteGoalHandler={deleteGoalHandler}
            />
          </div>
        )}

        {/* Footer hint */}
        <p className="text-center text-slate-600 dark:text-slate-400 text-xs mt-8 uppercase tracking-tighter">
          {goalsLimit == null
            ? "Unlimited goals. Stay focused."
            : `Focus on the top ${goalsLimit}. Ignore the rest.`}
        </p>
      </div>
    </div>
  );
};

export default Goal;
