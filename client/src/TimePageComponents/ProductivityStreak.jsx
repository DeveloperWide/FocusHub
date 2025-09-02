import React, { useState, useEffect } from 'react';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import axios from "axios";
import { getLast7Days } from '../utils/helper';
import { getToken } from "../utils/auth";

const ProductivityStreak = () => {
  const [week, setWeek] = useState([]);
  const [completedDays, setCompletedDays] = useState(new Set());
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setWeek(getLast7Days());
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/focus/focus-tasks`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }).then((res) => {
      const tasks = res.data.data;

      // Extract all dates where tasks were created
      const dates = new Set(
        tasks.map(task =>
          new Date(task.createdAt).toISOString().split("T")[0]
        )
      );

      setCompletedDays(dates);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div className='h-full w-full flex-col flex justify-center items-center'>
      <LocalFireDepartmentRoundedIcon sx={{ color: "#ff9501", fontSize: "200px" }} />
      <p className='text-xl font-bold text-gray-500'>{completedDays.size}-Day Streak!</p>
      
      <div className="flex gap-3 justify-center mt-4">
        {week.map((day, idx) => {
          const isCompleted = completedDays.has(day.date);
          return (
            <div
              key={idx}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold 
                ${isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}
            >
              {isCompleted ? <CheckCircleOutlineRoundedIcon sx={{fontSize: "50px"}} /> : day.label}
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default ProductivityStreak;
