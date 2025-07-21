import React from 'react'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import { useState } from 'react';


const Home = () => {
    const [ShowLogin, setShowLogin] = useState(false)
    const [HandleClick, setHandleClick] = useState(false)
    const Handllick = () => {
        setHandleClick(true)
    }

    return (
        <>
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div></div>


            <div className='flex justify-center items-center my-5'>
                <h2 className="text-3xl text-indigo-500 font-semibold flex items-center gap-1">
                    FocusHub <BarChartRoundedIcon className="text-blue-500" />
                </h2>
            </div>

            <div className='flex justify-center items-center my-[10vh]'>

                <div className='login_box bg-white shadow-2xl h-[70vh] min-w-[40vw] h-auto'>
                    < div className='flex justify-center items-center grid-cols-2'>
                        <div onClick={() => setShowLogin(true)} className=' flex justify-center items-center w-1/2 h-14 opacity-80 text-xl' style={{ background: ShowLogin ? 'blue' : 'white', color:ShowLogin?'white': 'black' }}>Login</div>

                        <div onClick={() => setShowLogin(false)} className=' flex justify-center items-center w-1/2 h-14 opacity-80 text-xl'style={{background: ShowLogin ? 'white' : 'blue', color: ShowLogin? 'black': 'white'}}>Sign Up</div>
                    </div>
                    {/* form  */}
                    {ShowLogin ? (
                        // login 
                        <>
                            <div className='flex justify-center items-center flex-col my-15'>
                                <div className=''>
                                    <label className="block text-xl font-semibold text-shadow-lg">Username</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Username"
                                        className="w-[20vw] shadow-2xl  p-2 "
                                    />
                                </div>
                            </div>

                            <div className='flex justify-center items-center flex-col my-15'>

                                <div>
                                    <label className="block text-xl font-semibold text-shadow-lg">Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter Password"
                                        className="  w-[20vw] shadow-2xl p-2"
                                    />
                                </div>
                            </div>
                            <div className='flex justify-center items-center'>
                                <button className="w-40 bg-blue-500 text-white text-xl font-medium p-2 rounded shadow-2xl active:shadow-blue-400 mb-15 ">Login</button>
                            </div>
                        </>
                    ) : (
                        // sign up 
                        <>
                            <div
                                className='flex flex-col justify-center items-center my-5 gap-5'
                                style={{ display: HandleClick ? "none" : "flex" }}
                            >
                                <h1 className='font-bold text-2xl'>Welcome..!</h1>
                                <div>
                                    <div onClick={() => setHandleClick(true)} className='flex justify-center items-center w-40 border border-black hover:bg-black  hover:text-white text-xl font-medium p-2 rounded shadow-2xl active:shadow-gray-500 mb-15'>Get Start</div>
                                </div>
                            </div>
                            {HandleClick && (
                                <>
                                    <div className='flex justify-center items-center flex-col my-5'>
                                        <div>
                                            <label className="block text-xl font-semibold text-shadow-lg">Enter Username :</label>
                                            <input type="text" placeholder="Username" className="w-[20vw] shadow-2xl p-2" />
                                        </div>
                                    </div>

                                    <div className="flex justify-center max-w-[100vw]">
                                        <div className="line bg-[#7127BA] opacity-45 h-[2.5px] w-md rounded-full"></div>
                                    </div>

                                    <div className='flex justify-center items-center flex-col my-5'>
                                        <div>
                                            <label className="block text-xl font-semibold text-shadow-lg">Email Id :</label>
                                            <input type="email" placeholder="Email Id" className="w-[20vw] shadow-2xl p-2" />
                                        </div>
                                    </div>

                                    <div className="flex justify-center max-w-[100vw]">
                                        <div className="line bg-[#7127BA] opacity-45 h-[2.5px] w-md rounded-full"></div>
                                    </div>

                                    <div className='flex justify-center items-center flex-col my-5'>
                                        <div>
                                            <label className="block text-xl font-semibold text-shadow-lg">Phone Number</label>
                                            <input type="text" placeholder="xxx-xxx-xxxx" className="w-[20vw] shadow-2xl p-2" />
                                        </div>
                                    </div>
                                    <div className="flex justify-center max-w-[100vw]">
                                        <div className="line bg-[#7127BA] opacity-45 h-[2.5px] w-md rounded-full"></div>
                                    </div>

                                    <div className='flex justify-center items-center flex-col my-5'>
                                        <div>
                                            <label className="block text-xl font-semibold text-shadow-lg">Password</label>
                                            <input type="password" placeholder="Password" className="w-[20vw] shadow-2xl p-2" />
                                        </div>
                                    </div>

                                    <div className="flex justify-center max-w-[100vw]">
                                        <div className="line bg-[#7127BA] opacity-45 h-[2.5px] w-md rounded-full"></div>
                                    </div>

                                    <div className='flex justify-center items-center flex-col my-5'>
                                        <div>
                                            <label className="block text-xl font-semibold text-shadow-lg">Confirm Password</label>
                                            <input type="password" placeholder="Confirm Password" className="w-[20vw] shadow-2xl p-2" />
                                        </div>
                                    </div>

                                    <div className="flex justify-center max-w-[100vw]">
                                        <div className="line bg-[#7127BA] opacity-45 h-[2.5px] w-md rounded-full"></div>
                                    </div>

                                    <div className='flex justify-center items-center flex-col my-5'>
                                        <div>
                                            <button className="w-40 bg-blue-500 text-white text-xl font-medium p-2 rounded shadow-2xl active:shadow-blue-400 mb-15">Sign Up</button>
                                        </div>
                                    </div>
                                </>
                            )}


                        </>
                    )}
                </div>
            </div >



        </>

    );
};


export default Home
