import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import Header from "../layouts/Header";

const Task = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/api/tasks/").then((res) => {
      setData(res.data.data)
    }).catch((err) => {
      console.log(err);
    })
  }, []);


  console.log(data)

  return (
    <div>
      <Header />
      <div className="flex justify-between px-5 py-3">
        <h2 className="text-2xl font-semibold">My Tasks</h2>
        <div className="btns flex justify-center items-center gap-3">
          <button className="text-[14px] bg-blue-600 text-white font-semibold w-20 h-7 rounded">List</button>
          <button className="text-[14px]  font-semibold w-20 h-7 rounded">Board</button>
          <button className=" bg-blue-600 text-white font-semibold w-9 h-9 rounded text-center"><AddIcon sx={{fontSize: "20px"}} /></button>
        </div>
      </div>
      <div className="px-5">
        {data.map((task, idx) => {
          return (
            <li key={idx}>{task.title}</li>
          )
        })}
      </div>
    </div>
  )
}

export default Task