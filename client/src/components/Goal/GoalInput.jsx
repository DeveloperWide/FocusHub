import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

const GoalInput = ({
  addGoalHandler,
  updateGoalHandler,
  editingGoal,
  setEditingGoal,
}) => {
  const [goal, setGoal] = useState({
    title: "", //
    tag: "",
  });

  useEffect(() => {
    // object
    if (editingGoal) {
      setGoal({
        title: editingGoal.title,
        tag: editingGoal.tag,
      });
    }
  }, [editingGoal]);

  const onChangeHandler = (e) => {
    setGoal((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-4">
        <TextField
          label="What's the goal?"
          variant="filled"
          fullWidth
          value={goal.title}
          name="title"
          onChange={onChangeHandler}
          className="flex"
          sx={{
            "& .MuiFilledInput-root": {
              backgroundColor: "#e3e0d8",
              color: "black",
              borderRadius: "12px",
              "&:before, &:after": { display: "none" },
              "&:hover": { backgroundColor: "#e3e0dc" },
            },
            "& .MuiInputLabel-root": { color: "gray" },
          }}
        />
        <TextField
          label="Tag"
          variant="filled"
          value={goal.tag}
          name="tag"
          onChange={onChangeHandler}
          sx={{
            "& .MuiFilledInput-root": {
              backgroundColor: "#e3e0d8",
              color: "#3299ab",
              fontWeight: "bold",
              borderRadius: "12px",
              "&:before, &:after": { display: "none" },
              "&:hover": { backgroundColor: "#e3e0dc" },
            },
            "& .MuiInputLabel-root": { color: "gray" },
          }}
        />
      </div>
      <div className="">
        <button
          onClick={() => {
            if (editingGoal) {
              updateGoalHandler(editingGoal.id, goal);
              setEditingGoal(null);
            } else {
              addGoalHandler(goal, setGoal);
            }

            setGoal({ title: "", tag: "" });
          }}
          disabled={!goal.title.trim() || !goal.tag.trim()}
          className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all
                ${
                  !goal.title.trim() || !goal.tag.trim()
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-700 to-green-900 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-[0.98]"
                }`}
        >
          {editingGoal ? "Update Goal" : "Lock It In"}
        </button>
      </div>
    </div>
  );
};

export default GoalInput;
