import axios from 'axios';
import React, { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const TaskModal = ({ isOpen, onClose }) => {
    const [data, setData] = useState({
        title: "",
        priority: "High",
        isCompleted: "todo"
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("/api/tasks", data).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err)
        })
        onClose();
    };

    const onChangeHandler = (e) => {
        console.log(e.target.name)
        setData((taskObj) => {
            return { ...taskObj, [e.target.name]: e.target.value }
        })
    }

    return (
        <div className="fixed inset-0 bg-[#050404aa] flex items-center justify-center z-50">
            <div className="w-full max-w-[80%] sm:max-w-sm p-4 border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-white">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className='flex justify-between items-center'>
                        <h5 className="text-3xl font-medium text-gray-900 dark:text-black">Create Task</h5>
                        <ClearIcon onClick={() => {onClose()}} sx={{marginTop: "5px", color: "#333a", cursor: "pointer"}}/>
                    </div>
                    <div>
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Title</label>
                        <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-200 dark:text-black outline-none" value={data.title} onChange={onChangeHandler} required />
                    </div>

                    <div>
                        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Task Status</label>
                        <select name="isCompleted" id="isCompleted" value={data.isCompleted} onChange={onChangeHandler} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-200 dark:text-black outline-none">
                            <option value="todo">Todo</option>
                            <option value="in_Progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Task Priority</label>
                        <select name="priority" id="priority" value={data.priority} onChange={onChangeHandler} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-200 dark:text-black outline-none">
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700">
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
