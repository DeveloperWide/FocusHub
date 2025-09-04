import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import LabelIcon from '@mui/icons-material/Label';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import UpdateTask from '../components/UpdateTask';
import { getToken } from '../utils/auth';
import { toast } from 'react-toastify';

const ShowTask = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const token = getToken();
  console.log(token)

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }})
      .then((res) => {
        setData(res.data?.data);
        setProgress(res.data?.data?.inProgress || 0);
      })
      .catch((err) => console.log(err));
  }, [id]);


  const refetchTask = () => {
    axios
      .get(`${BASE_URL}/api/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }}
    ).then((res) => {
        setData(res.data?.data);
        setProgress(res.data?.data?.inProgress || 0);
      })
      .catch((err) => console.log(err));
  };

  const deleteTask = () => {    
    axios.delete(`${BASE_URL}/api/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      console.log(`Task Deletion Successful`)
      toast.success(res.data.message);
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

        
        <div className="btns flex justify-end gap-4 items-center px-2 py-4 pt-8">
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
