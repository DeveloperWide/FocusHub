import axios from 'axios';
import React, { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { getToken } from '../utils/auth';

const TaskModal = ({ isOpen, onClose, onSubmit }) => {
    const [data, setData] = useState({
        title: "",
        description: "",
        priority: "High",
        status: "todo",
        dueDate: Date.now,
        tags: "",
    });

    if (!isOpen) return null;
    const token = getToken();
    const handleSubmit = (e) => {
        e.preventDefault();
            // headers:{
            //     Authorization: `Bearer ${token}`,
            // }
        axios.post("/api/tasks", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                console.log(res);
                // 🔥 CALL onSubmit from parent after successful task creation
                onSubmit();
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const onChangeHandler = (e) => {
        console.log(e.target.name)
        setData((taskObj) => {
            return { ...taskObj, [e.target.name]: e.target.value }
        })
    }

    return (
        <div className="fixed inset-0 bg-[#050404aa] flex items-center justify-center z-50">
            <div className="w-full max-w-[80%] sm:max-w-[80%] p-4 border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-white max-h-[83%] overflow-x-scroll scrollbar-none createTaskScrollbar">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className='flex justify-between items-center'>
                        <h5 className="text-3xl font-medium text-gray-900 dark:text-black">Create Task</h5>
                        <ClearIcon onClick={() => { onClose() }} sx={{ marginTop: "5px", color: "#333a", cursor: "pointer" }} />
                    </div>
                    <div className='grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-5  gap-5'>
                        <div className='col-span-2 sm:col-span-3'>
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Title</label>
                            <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-200 dark:text-black outline-none" value={data.title} placeholder="Complete UI for Dashboard"
                                onChange={onChangeHandler} required />
                        </div>

                        <div >
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Task Status</label>
                            <select name="status" id="status" value={data.status} onChange={onChangeHandler} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-200 dark:text-black outline-none">
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

                    </div>
                    <div className='flex flex-col sm:flex-row  gap-8'>
                        <div className='flex-1'>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Description</label>
                            <textarea name="description" id="description"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-200 dark:text-black outline-none" value={data.description} placeholder="Describe the task details, subtasks, or deadlines..." onChange={onChangeHandler} rows="5" required></textarea>
                        </div>

                        <div className=' gap-10'>
                            <div className='mb-3'>
                                <label htmlFor="dueDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Due Date</label>
                                <input type="date" name="dueDate" value={data.dueDate} id="dueDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-200 dark:text-black outline-none"
                                    onChange={onChangeHandler} required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tags" className="block mb-1 text-sm font-medium text-gray-900 dark:text-black">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    id="tags"
                                    value={data.tags}
                                    onChange={onChangeHandler}
                                    required
                                    placeholder="e.g., frontend, urgent, personal"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-200 dark:text-black outline-none"
                                />

                            </div>

                        </div>
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
