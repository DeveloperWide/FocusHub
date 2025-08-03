import React from 'react'

const Profile = () => {
    return (
        <div className="flex flex-col w-full ">
            <h1 className='text-6xl font-cursive profile-heading  self-start px-5 py-2'>Profile</h1>
            <div className="flex flex-col md:flex-row-reverse w-full justify-between">
                 <div className="profile-card flex flex-col justify-center items-center w-[100%] sm:w-[50%] md:w-[30%] p-4">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs42w7bN0-F5Dul_AhIss8Ibg7M1teHU7xlQ&s" className='h-50 w-50 rounded-full px-1 py-1' alt="Profile"/>
                    <h2 className='text-2xl font-semibold'>Mahesh Babu</h2>
                    <p className='text-gray-500'>maheshbabu@gmail.com</p>
                </div>
                <div className="update-profile-card w-[100%] sm:w-[50%] md:w-[70%]  p-4 bg-white m-5">
                    <h3 className='text-3xl mb-4 text-gray-800 update-profile font-cursive'>Update Profile</h3>
                    <form className="flex flex-col py-4 w-full text-sm text-slate-800">
                        <div className="px-4">
                            <label htmlFor="name" className="font-medium">Full Name</label>
                            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.311 16.406a9.64 9.64 0 0 0-4.748-4.158 5.938 5.938 0 1 0-7.125 0 9.64 9.64 0 0 0-4.749 4.158.937.937 0 1 0 1.623.938c1.416-2.447 3.916-3.906 6.688-3.906 2.773 0 5.273 1.46 6.689 3.906a.938.938 0 0 0 1.622-.938M5.938 7.5a4.063 4.063 0 1 1 8.125 0 4.063 4.063 0 0 1-8.125 0" fill="#475569" />
                                </svg>
                                <input type="text" className="h-full px-2 w-full outline-none bg-transparent" placeholder="Enter your full name" required />
                            </div>

                            <label htmlFor="email-address" className="font-medium mt-4">Email Address</label>
                            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5 3.438h-15a.937.937 0 0 0-.937.937V15a1.563 1.563 0 0 0 1.562 1.563h13.75A1.563 1.563 0 0 0 18.438 15V4.375a.94.94 0 0 0-.938-.937m-2.41 1.874L10 9.979 4.91 5.313zM3.438 14.688v-8.18l5.928 5.434a.937.937 0 0 0 1.268 0l5.929-5.435v8.182z" fill="#475569" />
                                </svg>
                                <input type="email" className="h-full px-2 w-full outline-none bg-transparent" placeholder="Enter your email address" required />
                            </div>

                            <label htmlFor="message" className="font-medium mt-4">Message</label>
                            <textarea rows="4" className="w-full mt-2 p-2 bg-transparent border border-slate-300 rounded-lg resize-none outline-none focus:ring-2 focus-within:ring-indigo-400 transition-all" placeholder="Enter your message" required></textarea>

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
        </div>
    )
}

export default Profile