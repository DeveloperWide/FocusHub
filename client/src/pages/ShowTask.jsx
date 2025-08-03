import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import LabelIcon from '@mui/icons-material/Label';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import UpdateTask from '../components/UpdateTask';

const ShowTask = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/tasks/${id}`)
      .then((res) => {
        setData(res.data?.data);
        setProgress(res.data?.data?.inProgress || 0);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleProgressChange = async (e) => {
    const value = Number(e.target.value);
    setProgress(value);

    try {
      await axios.patch(`/api/tasks/${id}`, { inProgress: value });
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const refetchTask = () => {
    axios
      .get(`/api/tasks/${id}`)
      .then((res) => {
        setData(res.data?.data);
        setProgress(res.data?.data?.inProgress || 0);
      })
      .catch((err) => console.log(err));
  };

  const deleteTask = () => {    
    axios.delete(`/api/tasks/${id}`).then((res) => {
      console.log(`Task Deletion Successful`)
      navigate("/app/tasks" , {state: {refresh: true}}) // redirect + pass refresh flag
    }).catch((err) => {
      console.log(`Task Deletion Failed`)
      console.log(err)
    })
  }

  return (
    <div className="min-h-screen px-4 md:px-20 py-10 bg-[#f4f6f8]">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b] capitalize">{data?.title}</h1>
          <p className="text-gray-600 mt-2 text-[15px]">{data?.description}</p>
        </div>

        {/* Task Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[15px]">
          <div className="flex items-center gap-2">
            <CalendarMonthIcon className="text-blue-500" />
            <span><b>Due:</b> {data?.dueDate && new Date(data?.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <LabelIcon className="text-purple-500" />
            <span><b>Tags:</b> {data?.tags || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <OutlinedFlagIcon className="text-red-500" />
            <span><b>Priority:</b> {data?.priority}</span>
          </div>
          <div className="flex items-center gap-2">
            <AssignmentTurnedInIcon className="text-green-600" />
            <span><b>Status:</b> {data?.status}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="relative my-10">
          <label htmlFor="task-range" className="block font-semibold text-[17px] mb-2">
            Task Progress: <span className="text-blue-700 font-bold">{progress}%</span>
          </label>
          <input
            id="task-range"
            type="range"
            min="0"
            max="100"
            step="1"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />

          {/* Large Screens: 0, 25, 75, 100 */}
          <div className="hidden md:flex justify-between text-sm mt-2 px-1">
            <span className="text-gray-500">Todo</span>
            <span className="text-yellow-500 hidden lg:inline-block">In Progress (25%)</span>
            <span className="text-yellow-500 hidden lg:inline-block">In Progress (75%)</span>
            <span className="text-green-600">Done</span>
          </div>

          {/* Medium Screens Only: 50% */}
          <div className="flex md:hidden justify-center text-sm mt-2">
            <span className="text-yellow-600 font-semibold">50%</span>
          </div>

          {/* Small Screens: 0% 50% 100% */}
          <div className="flex justify-between text-xs mt-2 md:hidden">
            <span className="text-gray-500">0%</span>
            <span className="text-gray-500">50%</span>
            <span className="text-gray-500">100%</span>
          </div>
        </div>
        <div className="btns flex justify-end gap-4 items-center px-2">
          <button disabled={!data} className={`updateBtn ${!data ? "bg-green-100" : "bg-green-700"}`} onClick={() => setModalOpen(true)}>Update</button>
          <button className='deleteBtn bg-red-700' onClick={deleteTask}>Delete</button>
        </div>
      </div>
      {data && <UpdateTask
        task={data}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => {
          refetchTask();      // Refresh task after update
          setModalOpen(false); // Close modal
        }}
      />}

    </div>
  );
};

export default ShowTask;
