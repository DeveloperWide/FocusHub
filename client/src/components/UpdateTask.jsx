import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { useParams } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { toast } from 'react-toastify';

const UpdateTask = ({ task, isOpen, onClose, onSubmit }) => {
    let { id } = useParams();

    // Keep original task for comparison
    const originalTaskRef = useRef(task);

    const [data, setData] = useState(() => ({
        ...task
    }));

    if (!isOpen) return null;

    const onChangeHandler = (e) => {
        setData((taskObj) => ({
            ...taskObj,
            [e.target.name]: e.target.value
        }));
    };

    const isFormChanged = () => {
        // Convert dates to strings to avoid mismatch from Date object vs string
        const current = { ...data, dueDate: data.dueDate?.slice(0, 10) };
        const original = { 
            ...originalTaskRef.current, 
            dueDate: originalTaskRef.current.dueDate?.slice(0, 10) 
        };
        return JSON.stringify(current) !== JSON.stringify(original);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`/api/tasks/${id}`, data, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
        .then((res) => {
            onSubmit();
            toast.success(res.data.message);
        })
        .catch((err) => {
            if (err.response) {
                toast.error(err.response.data.message || "Something Went Wrong");
            } else {
                toast.error("Network/Error: " + err.message);
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-[#050404aa] flex items-center justify-center z-50">
            <div className="w-full max-w-[80%] sm:max-w-[80%] p-4 border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-white max-h-[83%] overflow-x-scroll scrollbar-none createTaskScrollbar">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className='flex justify-between items-center'>
                        <h5 className="text-3xl font-medium text-gray-900 dark:text-black">Update Task</h5>
                        <ClearIcon onClick={onClose} sx={{ marginTop: "5px", color: "#333a", cursor: "pointer" }} />
                    </div>
                    <div className='grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-5 gap-5'>
                        <div className='col-span-2 sm:col-span-3'>
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Title</label>
                            <input type="text" name="title" id="title" value={data.title}
                                onChange={onChangeHandler} required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none"
                                placeholder="Complete UI for Dashboard" />
                        </div>
                        <div>
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Task Status</label>
                            <select name="status" id="status" value={data.status} onChange={onChangeHandler}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none">
                                <option value="todo">Todo</option>
                                <option value="in_Progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Task Priority</label>
                            <select name="priority" id="priority" value={data.priority} onChange={onChangeHandler}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none">
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex flex-col sm:flex-row gap-8'>
                        <div className='flex-1'>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Description</label>
                            <textarea name="description" id="description" value={data.description}
                                onChange={onChangeHandler} rows="5" required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none"
                                placeholder="Describe the task details..." />
                        </div>
                        <div>
                            <div className='mb-3'>
                                <label htmlFor="dueDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Due Date</label>
                                <input type="date" name="dueDate"
                                    value={data.dueDate ? data.dueDate.slice(0, 10) : ''}
                                    onChange={onChangeHandler} required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tags" className="block mb-1 text-sm font-medium text-gray-900 dark:text-black">Tags</label>
                                <input type="text" name="tags" id="tags" value={data.tags}
                                    onChange={onChangeHandler} required
                                    placeholder="e.g., frontend, urgent"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end'>
                        <button type="submit"
                            disabled={!isFormChanged()}
                            className={`w-[150px] text-white ${isFormChanged() ? "bg-green-600 hover:bg-green-800" : "bg-gray-400 cursor-not-allowed"} font-medium rounded-lg text-sm px-5 py-2.5`}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTask;
