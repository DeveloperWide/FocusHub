import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";

const Goal = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  let [goal, setGoal] = useState({
    title: "", //
    tag: "",
  });

  let [goals, setGoals] = useState([]);

  const onChangeHandler = (e) => {
    setGoal((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const fetchGoals = () => {
    axios
      .get(`${BASE_URL}/api/goals`)
      .then((res) => {
        console.log(res.data.data);
        setGoals(res.data.data);
      })
      .catch((err) => {
        console.log(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addTask = () => {
    console.log("Adding task...");
    axios
      .post(`${BASE_URL}/api/goals`, goal)
      .then((res) => {
        console.log(res);

        setGoal(() => {
          return { title: "", tag: "" };
        }); // Clear title & tag after adding

        fetchGoals();
      })
      .catch((err) => {
        console.log(err);
        console.log(err?.response?.data?.message);
        toast.error(err?.response?.data?.message);
      });
  };

  const deleteGoal = (goalId) => {
    console.log(goalId);
    axios
      .delete(`${BASE_URL}/api/goals/${goalId}`)
      .then((res) => {
        console.log(res.data.message);
        fetchGoals();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            {goals.length < 3 ? "Target" : "Your"}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-400">
              Ambitions
            </span>
          </h1>
          <p className="text-slate-400 text-sm">
            {goals.length}/3 slots filled
          </p>
          {/* Simple Progress Bar */}
          <div className="w-24 h-1 bg-slate-800 mx-auto mt-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-400 transition-all duration-500"
              style={{ width: `${(goals.length / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8">
          {/* Input Section */}
          {goals.length < 3 && (
            <div className="space-y-4 mb-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <TextField
                  label="What's the goal?"
                  variant="filled"
                  fullWidth
                  value={goal.title}
                  name="title"
                  onChange={onChangeHandler}
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

              <button
                onClick={addTask}
                disabled={!goal.title.trim() || !goal.tag.trim()}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all
                ${
                  !goal.title.trim() || !goal.tag.trim()
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-700 to-green-900 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-[0.98]"
                }`}
              >
                Lock It In
              </button>
            </div>
          )}

          {/* Goals List */}
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
                  key={goal._id}
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

                  <button
                    onClick={() => deleteGoal(goal._id)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <ClearIcon
                      sx={{ color: "#ef4444", fontSize: 20, cursor: "pointer" }}
                    />
                  </button>
                </div>
              ))
            )}
          </div>
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
