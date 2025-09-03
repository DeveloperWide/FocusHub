import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect } from "react";
import { useState } from "react";

const Goal = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  let [goal, setGoal] = useState({
    title: "",
  });
  let [goals, setGoals] = useState([{}]);

  const handleChange = (e) => {
    setGoal(() => {
      return { [e.target.name]: e.target.value };
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
        console.log(err);
      });
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addTask = () => {
    axios
      .post(`${BASE_URL}/api/goals`, goal)
      .then((res) => {
        console.log(res);
        setGoal(() => {
          return { title: "" };
        }); // Clear title after adding
        fetchGoals();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onClickHanlder = () => {
    if (goal.title.trim() != "") {
      addTask();
    }
  };

  const onKeyDownHandler = (e) => {
    if(e.key === "Enter" && e.target.value != ""){
      addTask()
    }
  }

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
    <div>
      <h1 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl italic py-2 font-semibold">
        Write Your{" "}
        <span className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-orange-300">
          Goals
        </span>{" "}
        here
      </h1>
      <div className="px-4 py-3 w-full  flex items-center justify-center">
        <input
          type="text"
          name="title"
          placeholder="Enter Your Goal here..."
          id="title"
          className="border border-gray-400 outline-none px-2 py-2 rounded w-full md:w-[90%] lg:w-[80%]text-lg font-semibold"
          value={goal.title}
          onChange={handleChange}
          onKeyDown={onKeyDownHandler}
        />
        <button
          onClick={onClickHanlder}
          className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold cursor-pointer ms-1 rounded"
        >
          Add
        </button>
      </div>
      <div className="goals">
        <ul className="px-15 py-4">
          {goals.map((goal) => {
            return (
              <div className="flex justify-between gap-5 sm:gap-8 md:gap-12 lg:gap-14 w-full items-center">
                <li
                  key={`${goal._id}`}
                  className="text-[15px] sm:text-lg py-2 list-decimal font-semibold italic"
                >
                  {goal.title}
                </li>
                <ClearIcon
                  sx={{ color: "#f00a", fontSize: "19px", cursor: "pointer" }}
                  onClick={() => {
                    deleteGoal(goal._id);
                  }}
                />
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Goal;
