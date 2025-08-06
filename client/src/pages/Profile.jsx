import React, { useState } from 'react';
import axios from "axios";
import { getToken, getUser, saveUserData } from '../utils/auth';

const Profile = () => {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [data, setData] = useState({
        name: "",
        email: "",
    });

    const user = getUser();
    const handleOnChange = (e) => {
        setData(() => {
            return { ...data, [e.target.name]: e.target.value }
        })
    }

    const handleFileChange = (e) => {
        const selected = e.target.files[0]
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected)); // ✅ Show preview
        }
    };

    const handleDelete = () => {
        setFile(null);
        setPreview(null);
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        let token = getToken();
        let formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        if (file) formData.append('profileImage', file);
        axios.put("/api/profile/update", formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            let updatedUser = res.data.user._doc;
            console.log(updatedUser);

            const oldToken = getToken();
            console.log(oldToken);

            saveUserData(oldToken, updatedUser);
            window.location.reload()
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div className="flex flex-col w-full ">
            <div className="flex flex-col w-full justify-center items-center px-5 py-10">
                    <h3 className='text-3xl self-start mb-4 text-gray-800 update-profile'>Update Profile</h3>
                    <form className="flex flex-col py-4 w-[300px] sm:w-[350px] md:w-[480px] lg:w-[650px] border border-[#3333] shadow-2xl/60 shadow-[#333] rounded-2xl text-sm text-slate-800" onSubmit={onSubmitHandler}>
                        <div className="px-4 h-full">
                            <label htmlFor="name" className="font-medium">Name</label>
                            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.311 16.406a9.64 9.64 0 0 0-4.748-4.158 5.938 5.938 0 1 0-7.125 0 9.64 9.64 0 0 0-4.749 4.158.937.937 0 1 0 1.623.938c1.416-2.447 3.916-3.906 6.688-3.906 2.773 0 5.273 1.46 6.689 3.906a.938.938 0 0 0 1.622-.938M5.938 7.5a4.063 4.063 0 1 1 8.125 0 4.063 4.063 0 0 1-8.125 0" fill="#475569" />
                                </svg>
                                <input type="text" className="h-full px-2 w-full outline-none bg-transparent" name='name' value={data.name} onChange={handleOnChange} placeholder="Enter your full name" required />
                            </div>

                            <label htmlFor="email-address" className="font-medium mt-4">Email Address</label>
                            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5 3.438h-15a.937.937 0 0 0-.937.937V15a1.563 1.563 0 0 0 1.562 1.563h13.75A1.563 1.563 0 0 0 18.438 15V4.375a.94.94 0 0 0-.938-.937m-2.41 1.874L10 9.979 4.91 5.313zM3.438 14.688v-8.18l5.928 5.434a.937.937 0 0 0 1.268 0l5.929-5.435v8.182z" fill="#475569" />
                                </svg>
                                <input type="email" className="h-full px-2 w-full outline-none bg-transparent" name='email' value={data.email} onChange={handleOnChange} placeholder="Enter your email address" required />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label htmlFor="fileInput" className='font-semibold text-lg'>Upload Image</label>
                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    id="fileInput"
                                    name='profileImage'
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />

                                <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                                    <div
                                        className="group flex justify-center items-center size-20 border-2 border-dotted border-gray-300 text-gray-400 rounded-full hover:bg-gray-50 cursor-pointer overflow-hidden"
                                        onClick={() => document.getElementById("fileInput").click()}
                                    >
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <svg
                                                className="shrink-0 size-7"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <circle cx="12" cy="10" r="3"></circle>
                                                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                                            </svg>
                                        )}
                                    </div>

                                    <div className="grow flex items-center gap-x-2">
                                        <button
                                            type="button"
                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={() => document.getElementById("fileInput").click()}
                                        >
                                            <svg
                                                className="shrink-0 size-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="17 8 12 3 7 8"></polyline>
                                                <line x1="12" x2="12" y1="3" y2="15"></line>
                                            </svg>
                                            Upload photo
                                        </button>

                                        {preview && (
                                            <button
                                                type="button"
                                                className="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-500 shadow hover:bg-gray-50"
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="flex items-center justify-center gap-1 mt-5 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 w-full rounded-full transition">
                                Update Profile
                                <svg className="mt-0.5" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m18.038 10.663-5.625 5.625a.94.94 0 0 1-1.328-1.328l4.024-4.023H3.625a.938.938 0 0 1 0-1.875h11.484l-4.022-4.025a.94.94 0 0 1 1.328-1.328l5.625 5.625a.935.935 0 0 1-.002 1.33" fill="#fff" />
                                </svg>
                            </button>
                        </div>
                    </form>

            </div>
        </div>
    )
}

export default Profile